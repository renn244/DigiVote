import { IsString, Matches } from 'class-validator'
import { Match } from 'src/lib/decorator/Match.decorator';

export class RegistrationAdminDto {
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

export class RegistrationUserDto extends RegistrationAdminDto {

    @IsString()
    education_level: string;

    @IsString()
    student_id: string;

    @IsString()
    course: string;

    @IsString()
    year_level: string;
}

export class LoginDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export class ForgotPasswordDto {
    @IsString({
        message: 'Email is required'
    })
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.sti\.edu\.ph$/, {
        message: 'Invalid email'
    })
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    newPassword: string;

    @IsString()
    @Match('newPassword', {
        message: 'Passwords do not match'
    })
    confirmPassword: string;

    @IsString()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.sti\.edu\.ph$/, {
        message: 'Invalid email'
    })
    email: string;
}