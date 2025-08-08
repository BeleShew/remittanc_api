import { Module } from '@nestjs/common';
import { RemittancesApiGatewayController } from './remittances-api-gateway.controller';
import { RemittancesApiGatewayService } from './remittances-api-gateway.service';
import { UsersModule } from './users/users.module';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UsersModule, TransactionModule],
  controllers: [RemittancesApiGatewayController,],
  providers: [RemittancesApiGatewayService,],
})
export class RemittancesApiGatewayModule { }
