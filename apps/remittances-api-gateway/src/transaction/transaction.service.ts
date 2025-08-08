import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from 'apps/transactions/src/dto/create.transaction.request.dto';

@Injectable()
export class TransactionService {

    constructor(@Inject('TRANSACTION') private userClient: ClientProxy) { }
    createTransaction(transaction: CreateTransactionRequestDto) {
        return this.userClient.send('transactions-create', transaction);
    }
}
