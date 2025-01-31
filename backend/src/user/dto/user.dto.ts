import { IsString } from "class-validator";
import { Match } from "src/lib/decorator/Match.decorator";

export class ChangePasswordDto {
    @IsString()
    currentPassword: string;

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

export class ChangePasswordAdminDto {
    @IsString()
    password: string;

    @IsString()
    @Match('password', {
        message: 'Password does not match'
    })
    confirmPassword: string;
}

export class updateUserInfoAdmin extends updateUserInfoDto {
    @IsString()
    student_id: string;

    @IsString()
    education_level: string;

    @IsString()
    year_level: number;

    @IsString()
    course: string;
} 

export class getInTouchDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    message: string;
}