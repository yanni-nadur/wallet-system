import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class User {
	@OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Exclude()
	@Column()
	password: string;

	@Column({ type: 'decimal', default: 0 })
	balance: number;
}
