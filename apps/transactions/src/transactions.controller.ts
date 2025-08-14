import { Controller, } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from './dto/create.transaction.request.dto';
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @MessagePattern('transactions-create')
  transactionsCreate(payload: { senderId: string; transaction: CreateTransactionRequestDto }) {
    const { senderId, transaction } = payload;
    console.log('Transaction Microservices  Users Id:', senderId);
    console.log('Transaction Microservices request:', transaction);
    return this.transactionsService.create(senderId, transaction);
  }

  @MessagePattern('transactions-delete')
  transactionsDelete({ transactionId, userId }: { transactionId: string; userId: string }) {
    console.log('Delete transaction request Micro services:', transactionId);
    console.log('User ID Micro services:', userId);
    return this.transactionsService.delete(transactionId, userId);
  }
  @MessagePattern('transactions-findBySenderId')
  transactionsFindBySenderId(currentUserId: string) {
    console.log('Find transactions by senderId Micro services:', currentUserId);
    return this.transactionsService.findAllTransactionByCurrentUser(currentUserId);
  }
}
