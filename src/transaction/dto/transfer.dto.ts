import { IsEmail, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
	@ApiProperty({
		description: 'Recipient email address',
		example: 'recipient@example.com',
	})
	@IsEmail({}, { message: 'Recipient email must be a valid email address' })
	recipientEmail: string;

	@ApiProperty({
		description: 'Amount to transfer',
		minimum: 0.01,
		example: 50.00,
	})
	@IsNumber()
	@Min(0.01, { message: 'Transfer amount must be greater than zero' })
	amount: number;
}
