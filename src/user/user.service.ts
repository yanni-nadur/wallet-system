import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const { email, password } = createUserDto;
		const userExists = await this.usersRepository.findOne({ where: { email } });
		if (userExists) {
			throw new ConflictException('Email already registered');
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = this.usersRepository.create({
			email,
			password: hashedPassword,
			balance: 0,
		});
		return this.usersRepository.save(user);
	}

	async findByEmail(email: string): Promise<User | null | undefined> {
		return this.usersRepository.findOneBy({ email });
	}
}
