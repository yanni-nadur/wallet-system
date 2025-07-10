import { IsNotEmpty } from 'class-validator';

export class DepositDto {
    @IsNotEmpty()
    amount: number;
}