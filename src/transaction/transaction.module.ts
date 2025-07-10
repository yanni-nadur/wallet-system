import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { User } from '../user/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Transaction, User]),
	],
	providers: [TransactionService],
	controllers: [TransactionController],
	exports: [TransactionService],
})
export class TransactionModule {}
