import { IsEmail, IsNumber, Min } from 'class-validator';
export class TransferDto {
	@IsEmail({}, { message: 'Recipient email must be a valid email address' })
	recipientEmail: string;

	@IsNumber()
	@Min(0.01, { message: 'Transfer amount must be greater than zero' })
	amount: number;
}
