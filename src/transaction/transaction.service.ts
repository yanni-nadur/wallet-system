import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private transactionRepository: Repository<Transaction>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private dataSource: DataSource,
	) {}

	async deposit(userId: number, amount: number): Promise<Transaction> {
		if (amount <= 0) {
			throw new BadRequestException('Amount must be positive');
		}

		return this.dataSource.transaction(async manager => {
			const user = await manager.findOne(User, { where: { id: userId } });
			if (!user) {
				throw new BadRequestException('User not found');
			}

			user.balance = Number(user.balance) + amount;
			await manager.save(user);

			const transaction = manager.create(Transaction, {
				fromUser: user,
				toUser: null,
				type: TransactionType.DEPOSIT,
				amount,
				reversed: false,
			});

			return manager.save(transaction);
		});
	}
}
