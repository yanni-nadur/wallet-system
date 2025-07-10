import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum TransactionType {
	DEPOSIT = 'deposit',
	TRANSFER = 'transfer',
	REVERSAL = 'reversal',
}

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.id, { nullable: false })
	fromUser: User;

	@ManyToOne(() => User, user => user.id, { nullable: true })
	toUser: User | null;

	@Column({ type: 'enum', enum: TransactionType })
	type: TransactionType;

	@Column({ type: 'decimal' })
	amount: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ default: false })
	reversed: boolean;
}
