import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransferDto {
    @IsNotEmpty()
    recipientEmail: string;

    @IsNumber()
    @Min(0.01)
    amount: number;
}

