import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
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
		userPlain.balance = Number(userPlain.balance);
		return userPlain;
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async findAll() {
		const users = await this.userService.findAll();
		return instanceToPlain(users);
	}
}
