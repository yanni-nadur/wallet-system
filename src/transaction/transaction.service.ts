import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
@Injectable()
export class TransactionService {
	constructor(private dataSource: DataSource) {}

	async deposit(userId: number, amount: number): Promise<Transaction> {
		return this.dataSource.transaction(async (manager) => {
			const userRepo = manager.getRepository(User);
			const transactionRepo = manager.getRepository(Transaction);

			const user = await userRepo.findOneBy({ id: userId });
			if (!user) throw new NotFoundException('User not found');

			user.balance = Number(user.balance) + amount;
			await userRepo.save(user);

			const transaction = transactionRepo.create({
				user,
				amount,
				type: 'deposit',
			});
			return await transactionRepo.save(transaction);
		});
	}

	async transfer(senderId: number, recipientEmail: string, amount: number): Promise<Transaction> {
		if (amount <= 0) {
			throw new BadRequestException('Amount must be positive');
		}
	
		return this.dataSource.transaction(async (manager) => {
			const userRepo = manager.getRepository(User);
			const transactionRepo = manager.getRepository(Transaction);
		
			const sender = await userRepo.findOneBy({ id: senderId });
			if (!sender) throw new NotFoundException('Sender not found');
		
			const recipient = await userRepo.findOneBy({ email: recipientEmail });
			if (!recipient) throw new NotFoundException('Recipient not found');
		
			if (sender.id === recipient.id) {
				throw new BadRequestException('Cannot transfer to yourself');
			}
		
			if (Number(sender.balance) < amount) {
				throw new BadRequestException('Insufficient balance');
			}
		
			sender.balance = Number(sender.balance) - amount;
			if (sender.balance < 0) {
				throw new BadRequestException('Balance cannot be negative');
			}
			await userRepo.save(sender);
		
			recipient.balance = Number(recipient.balance) + amount;
			await userRepo.save(recipient);
		
			const transaction = transactionRepo.create({
				user: sender,
				amount,
				type: 'transfer',
			});
			return await transactionRepo.save(transaction);
		});
	}

	async reverseTransaction(userId: number, transactionId: number): Promise<Transaction> {
		return this.dataSource.transaction(async (manager) => {
			const transactionRepo = manager.getRepository(Transaction);
			const userRepo = manager.getRepository(User);
		
			const originalTransaction = await transactionRepo.findOne({
				where: { id: transactionId },
				relations: ['user'],
			});
		
			if (!originalTransaction) {
				throw new NotFoundException('Transaction not found');
			}
		
			if (originalTransaction.type === 'reversal') {
				throw new BadRequestException('Cannot reverse a reversal transaction');
			}
		
			const alreadyReversed = await transactionRepo.findOne({
				where: { reversedTransaction: { id: transactionId } },
			});
		
			if (alreadyReversed) {
				throw new BadRequestException('Transaction already reversed');
			}
		
			if (originalTransaction.user.id !== userId) {
				throw new ForbiddenException('You can only reverse your own transactions');
			}
		
			if (originalTransaction.type === 'deposit') {
				const user = await userRepo.findOneBy({ id: userId });
				if (!user) throw new NotFoundException('User not found');
		
				if (Number(user.balance) < Number(originalTransaction.amount)) {
					throw new BadRequestException('Insufficient balance to reverse deposit');
				}
		
				user.balance = Number(user.balance) - Number(originalTransaction.amount);
				await userRepo.save(user);
		
			} else if (originalTransaction.type === 'transfer') {
				const sender = await userRepo.findOneBy({ id: userId });

				if (!sender) throw new NotFoundException('Sender not found');
		
				if (Number(sender.balance) < Number(originalTransaction.amount)) {
					throw new BadRequestException('Insufficient balance to reverse transfer');
				}
		
				sender.balance = Number(sender.balance) + Number(originalTransaction.amount);
				await userRepo.save(sender);
		
			} else {
				throw new BadRequestException('Unsupported transaction type for reversal');
			}
		
			const reversal = transactionRepo.create({
				user: originalTransaction.user,
				amount: originalTransaction.amount,
				type: 'reversal',
				reversedTransaction: originalTransaction,
			});
		
			return await transactionRepo.save(reversal);
		});
	  }
}
