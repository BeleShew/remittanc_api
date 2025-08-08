import { OperationResult } from '@app/common/operation.result.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/users/src/dto/create.user.dto';
import { LoginDto } from 'apps/users/src/dto/login.request.dto';
import { UpdateUserDto } from 'apps/users/src/dto/update.user.dto';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {

    constructor(@Inject('USER_CLIENT') private userClient: ClientProxy) { }

    register(createUserDto: CreateUserDto): Observable<OperationResult<CreateUserDto>> {
        return this.userClient.send('users-register', createUserDto);
    }
    login(loginDto: LoginDto) {
        return this.userClient.send('users-login', loginDto);
    }
    findByEmail(email: string) {
        return this.userClient.send('users-getUserById', email);
    }
    deleteUserByEmail(email: string) {
        return this.userClient.send('users-deleteUserById', email);
    }
    updateUserByEmail(email: string, updateDto: UpdateUserDto) {
        return this.userClient.send('users-updateUserById', { email, updateDto });
    }
}
