import { Controller, } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from './dto/create.transaction.request.dto';
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @MessagePattern('transactions-create')
  transactionsCreate(transaction: CreateTransactionRequestDto) {
    return this.transactionsService.create(transaction);
  }
}
