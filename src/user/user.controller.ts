import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { classToPlain } from 'class-transformer';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.userService.create(createUserDto);
		const userPlain = classToPlain(user) as any;
		userPlain.balance = Number(userPlain.balance);
		return userPlain;
	}
}
