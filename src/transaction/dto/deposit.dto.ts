import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
	@ApiProperty({
		description: 'Amount to deposit',
		minimum: 0.01,
		example: 100.50,
	})
	@IsNumber()
	@Min(0.01, { message: 'Deposit amount must be greater than zero' })
	amount: number;
}
