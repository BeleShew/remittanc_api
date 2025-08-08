import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
    imports: [
        ClientsModule.register([
            { name: 'TRANSACTION', transport: Transport.TCP, options: { port: 3012 }, },
        ]),
    ],
    providers: [TransactionService],
    controllers: [TransactionController]
})
export class TransactionModule { }
