import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.userService.create(createUserDto);
		const userPlain = instanceToPlain(user) as any;

		userPlain.balance = Number(userPlain.balance).toFixed(2);

		return userPlain;
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, description: 'List of users' })
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
