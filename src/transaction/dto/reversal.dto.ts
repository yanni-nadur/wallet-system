import { IsNumber, Min } from 'class-validator';
export class ReversalDto {
	@IsNumber()
	@Min(1, { message: 'Valid transactionId must be provided' })
	transactionId: number;
}
