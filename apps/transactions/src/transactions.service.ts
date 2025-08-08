import { OperationResult } from '@app/common/operation.result.dto';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { FirebaseService } from '@app/common/firebase/firebase.service';
import { CreateTransactionRequestDto } from './dto/create.transaction.request.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly firebaseService: FirebaseService) { }

  private get db(): admin.firestore.Firestore {
    return this.firebaseService.getDb();
  }

  async create(request: CreateTransactionRequestDto): Promise<OperationResult<CreateTransactionDto>> {
    try {

      console.log('Incoming transaction request is here:', request);


      console.log('Creating transaction for senderId:', request.senderId, 'with data:', request);
      const docRef = this.db.collection('transactions').doc();
      const transaction: CreateTransactionDto = {
        senderId: request.senderId,
        transactionId: docRef.id,
        timestamp: new Date(),
        status: 'completed',
        currency: request.currency,
        receiverId: request.receiverId,
        amount: request.amount,
      };

      await docRef.set(transaction);

      console.log(`Transaction ${transaction.transactionId} created.`);
      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'Transaction created successfully',
        data: transaction,
      };
    } catch (error: any) {
      console.error('Create transaction error:', error);
      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'An error occurred while creating the transaction.',
        errorCode: error.code || 'UNKNOWN_ERROR',
        errorList: [error.message || 'Unknown error'],
      };
    }
  }
}

