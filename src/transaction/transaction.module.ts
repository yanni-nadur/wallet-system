import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Transaction, User])],
	providers: [TransactionService],
	controllers: [TransactionController],
})
export class TransactionModule {}
