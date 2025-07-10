import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.userService.create(createUserDto);
		const userPlain = instanceToPlain(user) as any;

		userPlain.balance = Number(userPlain.balance).toFixed(2);

		return userPlain;
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async findAll() {
		const users = await this.userService.findAll();

		const usersFormatted = users.map(user => {
			const plainUser = instanceToPlain(user) as any;
			plainUser.balance = Number(plainUser.balance).toFixed(2);
			return plainUser;
		});

		return usersFormatted;
	}
}
