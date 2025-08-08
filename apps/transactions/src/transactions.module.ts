import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { FirebaseModule } from '@app/common/firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FirebaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule { }
