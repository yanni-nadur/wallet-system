import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.transactions, { eager: true })
	user: User;

	@Column({ type: 'decimal' })
	amount: number;

	@Column()
	type: 'deposit' | 'transfer' | 'reversal';

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Transaction, { nullable: true })
	@JoinColumn({ name: 'reversedTransactionId' })
	reversedTransaction?: Transaction;
}
