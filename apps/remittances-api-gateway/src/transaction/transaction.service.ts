import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from 'apps/transactions/src/dto/create.transaction.request.dto';

@Injectable()
export class TransactionService {

    constructor(@Inject('TRANSACTION') private transactionClient: ClientProxy) { }

    createTransaction(senderId: string, transaction: CreateTransactionRequestDto) {
        console.log('Transaction Users Id:', senderId);
        console.log('Transaction request:', transaction);
        return this.transactionClient.send('transactions-create', { senderId, transaction });
    }

    deleteTransaction(body: { transactionId: string; userId: string }) {
        return this.transactionClient.send('transactions-delete', body);
    }

    findBySenderId(senderId: string) {
        return this.transactionClient.send('transactions-findBySenderId', senderId);
    }
}
