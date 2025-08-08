import { OperationResult } from '@app/common/operation.result.dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async findBySenderId(senderId: string): Promise<OperationResult<CreateTransactionDto[]>> {
    try {
      console.log(`Searching for transactions sent by userId: ${senderId}`);

      const transactionsRef = this.db.collection('transactions');

      // Query transactions where senderId matches
      const sentQuery = transactionsRef.where('senderId', '==', senderId);
      const snapshot = await sentQuery.get();

      if (snapshot.empty) {
        console.log(`No transactions sent by userId: ${senderId}`);
        return {
          statusAPI: 'SUCCESS',
          messageAPI: 'No transactions found for the sender.',
          data: [],
        };
      }

      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: (data.timestamp as admin.firestore.Timestamp).toDate(),
        } as CreateTransactionDto;
      });

      // Sort by newest first (optional)
      transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'Transactions retrieved successfully',
        data: transactions,
      };
    } catch (error) {
      console.error(`Error finding transactions for senderId ${senderId}:`, error);
      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'An error occurred while fetching transactions.',
        errorCode: error.code || 'FETCH_FAILED',
        errorList: [error.message || 'Unknown error'],
        data: [],
      };
    }
  }


  async delete(transactionId: string, userId: string): Promise<OperationResult<CreateTransactionDto>> {
    const docRef = this.db.collection('transactions').doc(transactionId);
    try {
      const doc = await docRef.get();
      // 1. Check if the transaction exists
      if (!doc.exists) {
        throw new NotFoundException(`Transaction with ID ${transactionId} not found.`);
      }
      const transactionData = doc.data() as CreateTransactionDto;
      // 2. Security Check: Ensure the user deleting is the sender
      if (transactionData.senderId !== userId) {
        throw new UnauthorizedException('You are not authorized to delete this transaction.');
      }
      // 3. Delete the document
      await docRef.delete();
      console.log(`Transaction ${transactionId} deleted successfully by user ${userId}.`);
      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'Transaction deleted successfully',
        data: transactionData,
      };
    } catch (error) {
      console.error(`Failed to delete transaction ${transactionId}:`, error);
      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'An error occurred while deleting the transaction.',
        errorCode: error.code || (error instanceof UnauthorizedException ? 'AUTH_ERROR' : 'DELETE_FAILED'),
        errorList: [error.message],
      };
    }
  }
}

