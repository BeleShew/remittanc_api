import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionRequestDto {

    @IsString()
    @IsNotEmpty()
    senderId: string;

    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;
}