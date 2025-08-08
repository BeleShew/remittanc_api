import { FirebaseService } from '@app/common/firebase/firebase.service';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { LoginResponseDto } from './dto/login-response.dto';
import { OperationResult } from '@app/common/operation.result.dto';
import { LoginDto } from './dto/login.request.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update.user.dto';
import * as admin from 'firebase-admin';
import validator from 'validator';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService, private readonly configService: ConfigService) { }

  async register(createUserDto: CreateUserDto): Promise<OperationResult<Omit<UserRecord, 'passwordHash' | 'passwordSalt'>>> {
    try {
      const { emailAddress, password, firstName, lastName, phoneNumber } = createUserDto;
      const userRecord = await this.firebaseService.getAuth().createUser({
        email: emailAddress,
        password,
        displayName: `${firstName} ${lastName}`,
        phoneNumber,
      });
      const { passwordHash, passwordSalt, ...userRecordWithoutPassword } = userRecord as any;
      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'User registration successful',
        data: userRecordWithoutPassword,
      };
    } catch (error) {
      console.error('Firebase createUser error:', error);
      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'An error occurred during registration',
        errorCode: error.code,
        errorList: Array.isArray(error.message) ? error.message : [error.message],
      };
    }
  }

  async login(loginDto: LoginDto): Promise<OperationResult<LoginResponseDto>> {
    try {
      // const apiKey = "AIzaSyB3QdlZhm-4LnFVGR0PIv-SuxI_MSRHcW8";
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.configService.get<string>('FIREBASE_API_KEY')}`,
        {
          email: loginDto.email || '',
          password: loginDto.password,
          returnSecureToken: true,
        }
      );
      const data = response.data as {
        localId: string;
        email: string;
        idToken: string;
      };
      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'Login successful',
        data: {
          uid: data.localId,
          email: data.email,
          token: data.idToken,
        },
      };
    } catch (error) {
      return {
        statusAPI: 'ERROR',
        messageAPI: error.response?.data?.error?.message || 'Login failed',
        errorCode: error.response?.data?.error?.code,
        errorList: [error.response?.data?.error?.message || 'Login failed'],
      };
    }
  }

  async findByEmail(email: string): Promise<OperationResult<UserRecord>> {
    try {
      const user = await this.firebaseService.getAuth().getUserByEmail(email);
      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return {
          statusAPI: 'ERROR',
          messageAPI: `User with email ${email} not found.`,
          errorCode: error.code,
          errorList: [error.message],
        };
      }
      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'An error occurred while fetching the user',
        errorCode: error.code,
        errorList: [error.message],
      };
    }
  }

  async deleteUserByEmail(email: string): Promise<OperationResult<void>> {
    try {
      const user = await this.firebaseService.getAuth().getUserByEmail(email);
      await this.firebaseService.getAuth().deleteUser(user.uid);

      return {
        statusAPI: 'SUCCESS',
        messageAPI: `User with email ${email} deleted successfully.`,
      };
    } catch (error) {
      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'Error deleting user',
        errorCode: error.code,
        errorList: [error.message],
      };
    }
  }

  async updateUserByEmail(email: string, updateDto: UpdateUserDto): Promise<OperationResult<UserRecord>> {
    try {
      console.log('Updating user with email:', email, 'and data:', updateDto);

      // Get user by email to fetch UID
      const user = await this.firebaseService.getAuth().getUserByEmail(email);
      const updateData: Partial<admin.auth.UpdateRequest> = {};

      // Dynamically build updateData
      if (updateDto.firstName || updateDto.lastName) {
        updateData.displayName = `${updateDto.firstName ?? ''} ${updateDto.lastName ?? ''}`.trim();
      }
      if (updateDto.phoneNumber) {
        updateData.phoneNumber = updateDto.phoneNumber;
      }
      if (updateDto.password) {
        updateData.password = updateDto.password;
      }

      console.log('Prepared updateData:', updateData);

      const updatedUser = await this.firebaseService.getAuth().updateUser(user.uid, updateData);

      console.log('User updated successfully:', updatedUser);

      return {
        statusAPI: 'SUCCESS',
        messageAPI: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);

      if (error.code === 'auth/user-not-found') {
        return {
          statusAPI: 'ERROR',
          messageAPI: `User with email ${email} not found.`,
          errorCode: error.code,
          errorList: [error.message],
        };
      }

      return {
        statusAPI: 'ERROR',
        messageAPI: error.message || 'Error updating user',
        errorCode: error.code,
        errorList: [error.message],
      };
    }
  }

}
