import { Body, Controller, HttpCode, HttpStatus, Post, Delete, UseGuards, Req, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionRequestDto } from 'apps/transactions/src/dto/create.transaction.request.dto';
import { FirebaseAuthGuard } from '@app/common/auth/firebase-auth.guard';

@Controller('transaction')
@UseGuards(FirebaseAuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }
    @Post('create')
    @HttpCode(HttpStatus.OK)
    createTransaction(@Body() request: CreateTransactionRequestDto, @Req() req) {
        console.log('Transaction Users Id Belachew :', req.user);
        console.log('Transaction request :', request);
        if (!request.receiverId || !request.amount || !request.currency) {
            throw new Error('Invalid transaction request. Missing required fields.');
        }
        return this.transactionService.createTransaction(req.user.uid, request);
    }

    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    deleteTransaction(@Body() request: { transactionId: string }, @Req() req) {
        const { transactionId } = request;
        console.log('Delete transaction request:', transactionId);
        console.log('User ID:', req.user.uid);
        if (!transactionId || !req.user.uid) {
            throw new Error('Invalid delete request. Missing required fields.');
        }

        const body = { transactionId, userId: req.user.uid };
        console.log('Delete transaction body:', body);
        return this.transactionService.deleteTransaction(body);
    }

    @Get('findByUserId')
    @HttpCode(HttpStatus.OK)
    findBySenderId(@Req() req) {
        const userId = req.user.uid;
        console.log('Find transactions by userId:', userId);
        if (!userId) {
            throw new Error('Invalid request. Missing senderId.');
        }
        return this.transactionService.findBySenderId(userId);
    }
}
