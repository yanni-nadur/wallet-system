import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReversalDto {
	@ApiProperty({
		description: 'ID of the transaction to be reversed',
		minimum: 1,
		example: 123,
	})
	@IsNumber()
	@Min(1, { message: 'A valid transactionId must be provided' })
	transactionId: number;
}
