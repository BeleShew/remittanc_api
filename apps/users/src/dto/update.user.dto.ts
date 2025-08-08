import { IsString, IsNotEmpty, IsPhoneNumber, IsStrongPassword, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @IsStrongPassword()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
