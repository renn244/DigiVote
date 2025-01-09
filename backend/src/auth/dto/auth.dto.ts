import { IsString } from 'class-validator'
export class RegistrationDto {
    @IsString()
    username: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string; // we are going to get the branch from email
    
    @IsString()
    password: string;
}

export class LoginDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}