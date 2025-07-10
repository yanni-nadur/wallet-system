import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReversalDto {
    @IsNotEmpty()
    @IsNumber()
    transactionId: number;
}
