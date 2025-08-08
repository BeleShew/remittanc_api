import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    transactionId: string;

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

    @IsDate()
    @IsNotEmpty()
    timestamp: Date;

    @IsString()
    @IsNotEmpty()
    status: 'pending' | 'completed' | 'failed';
}
