import { Body, Controller, Get, Put, Delete, HttpStatus, HttpCode, Query, Post, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'apps/users/src/dto/create.user.dto';
import { LoginDto } from 'apps/users/src/dto/login.request.dto';
import { UpdateUserDto } from 'apps/users/src/dto/update.user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        console.log('Logging in user with UID:', loginDto);
        if (loginDto.email && loginDto.password) {
            return this.usersService.login(loginDto);
        }
        else {
            throw new Error('Email and password is required for login');
        }
    }

    @Get('findByEmail')
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(@Query('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email is required to fetch user');
        }
        return this.usersService.findByEmail(email);
    }

    @Delete('deleteByEmail')
    @HttpCode(HttpStatus.OK)
    deleteUserByEmail(@Query('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email is required to delete user');
        }
        return this.usersService.deleteUserByEmail(email);
    }

    @Put('updateByEmail')
    @HttpCode(HttpStatus.OK)
    updateUserByEmail(@Query('email') email: string, @Body() updateDto: UpdateUserDto,) {
        if (!email) {
            throw new BadRequestException('Email is required to update user');
        }
        if (!updateDto || Object.keys(updateDto).length === 0 || !Object.values(updateDto).some(value => value !== undefined)) {
            throw new BadRequestException('Update data is required');
        }
        return this.usersService.updateUserByEmail(email, updateDto);
    }
}



