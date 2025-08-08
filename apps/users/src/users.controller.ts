import { Controller, } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginDto } from './dto/login.request.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('users-register')
  async registerUser(createUserDto: CreateUserDto) {
    console.log('Registering user user services call:', createUserDto);
    return await this.usersService.register(createUserDto);
  }

  @MessagePattern('users-login')
  login(loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @MessagePattern('users-getUserById')
  getUserById(uid: string) {
    return this.usersService.findByEmail(uid);
  }

  @MessagePattern('users-deleteUserById')
  deleteUserById(email: string) {
    return this.usersService.deleteUserByEmail(email);
  }
  @MessagePattern('users-updateUserById')
  updateUser(email: string, updateDto: UpdateUserDto) {
    return this.usersService.updateUserByEmail(email, updateDto);
  }
}
