import { IsString } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    Password: string;

    @IsString()
    newPassword: string;
    
    @IsString()
    confirmPassword: string;
}

export class updateStudentInfoDto {
    @IsString()
    education_level: string;

    @IsString()
    year_level: number;

    @IsString()
    course: string;
}

export class updateUserInfoDto {
    @IsString()
    name: string;

    @IsString()
    email: string;
    
    @IsString()
    username: string;

    @IsString()
    branch: string;
}