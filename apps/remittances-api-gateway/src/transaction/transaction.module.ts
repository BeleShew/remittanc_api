import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { FirebaseService } from '@app/common/firebase/firebase.service';
@Module({
    imports: [
        ClientsModule.register([
            { name: 'TRANSACTION', transport: Transport.TCP, options: { port: 3012 }, },
        ]),
    ],
    providers: [TransactionService, FirebaseService],
    controllers: [TransactionController]
})
export class TransactionModule { }
