import { Body, Controller, HttpCode, HttpStatus, Post, Delete } from '@nestjs/common';
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


    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    deleteTransaction(@Body() body: { transactionId: string; userId: string }) {
        console.log('Delete transaction request:', body);
        if (!body.transactionId || !body.userId) {
            throw new Error('Invalid delete request. Missing required fields.');
        }
        return this.transactionService.deleteTransaction(body);
    }

    @Post('findByUserId')
    @HttpCode(HttpStatus.OK)
    findBySenderId(@Body('userId') userId: string) {
        console.log('Find transactions by senderId:', userId);
        if (!userId) {
            throw new Error('Invalid request. Missing senderId.');
        }
        return this.transactionService.findBySenderId(userId);
    }
}
