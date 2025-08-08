import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    emailAddress: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    @MinLength(6, { message: 'Enter valid phone number' })
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;
}