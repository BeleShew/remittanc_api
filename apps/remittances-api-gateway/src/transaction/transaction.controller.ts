import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionRequestDto } from 'apps/transactions/src/dto/create.transaction.request.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post('create')
    @HttpCode(HttpStatus.OK)
    createTransaction(@Body() request: CreateTransactionRequestDto) {
        console.log('Transaction request :', request);
        if (!request.senderId || !request.receiverId || !request.amount || !request.currency) {
            throw new Error('Invalid transaction request. Missing required fields.');
        }
        return this.transactionService.createTransaction(request);
    }
}
