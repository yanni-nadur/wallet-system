import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { instanceToPlain } from 'class-transformer';
import { TransferDto } from './dto/transfer.dto';
import { DepositDto } from './dto/deposit.dto';
import { ReversalDto } from './dto/reversal.dto';

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post('deposit')
	@UseGuards(JwtAuthGuard)
	async deposit(@Req() req, @Body() depositDto: DepositDto) {
		const userId = req.user.userId;
		const transaction = await this.transactionService.deposit(userId, depositDto.amount);

		const plainTransaction = instanceToPlain(transaction) as any;
		plainTransaction.user.balance = Number(plainTransaction.user.balance).toFixed(2);
		plainTransaction.amount = Number(plainTransaction.amount).toFixed(2);

		return plainTransaction;
	}

	@UseGuards(JwtAuthGuard)
	@Post('transfer')
	async transfer(@Req() req, @Body() transferDto: TransferDto) {
		const senderId = req.user.userId;
		const { recipientEmail, amount } = transferDto;

		const transaction = await this.transactionService.transfer(senderId, recipientEmail, amount);

		const plainTransaction = instanceToPlain(transaction) as any;
		plainTransaction.user.balance = Number(plainTransaction.user.balance).toFixed(2);
		plainTransaction.amount = Number(plainTransaction.amount).toFixed(2);

		return plainTransaction;
	}

	@UseGuards(JwtAuthGuard)
	@Post('reverse')
	async reverse(@Req() req, @Body() reversalDto: ReversalDto) {
		const userId = req.user.userId;
		const { transactionId } = reversalDto;

		const reversalTransaction = await this.transactionService.reverseTransaction(userId, transactionId);

		return {
			id: reversalTransaction.id,
			type: reversalTransaction.type,
			amount: Number(reversalTransaction.amount).toFixed(2),
			createdAt: reversalTransaction.createdAt,
			user: {
				id: reversalTransaction.user.id,
				email: reversalTransaction.user.email,
				balance: Number(reversalTransaction.user.balance).toFixed(2),
			},
			...(reversalTransaction.reversedTransaction && {
				reversedTransaction: {
					id: reversalTransaction.reversedTransaction.id,
					type: reversalTransaction.reversedTransaction.type,
					amount: Number(reversalTransaction.reversedTransaction.amount).toFixed(2),
					createdAt: reversalTransaction.reversedTransaction.createdAt,
				},
			}),
		};
	}
}
