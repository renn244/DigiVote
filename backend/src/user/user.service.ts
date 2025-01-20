import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { ChangePasswordDto, updateStudentInfoDto, updateUserInfoDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
    ) {}

    async getUsers(user: UserType) {

        const users = await this.sql`
            SELECT id, name, student_id, year_level, course
            FROM users
            WHERE branch = ${user.branch}
        `

        return users
    }

    async changePassword(user: UserType, body: ChangePasswordDto) {
        const { Password, newPassword, confirmPassword } = body

        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Password does not match')
        }

        const getUser = await this.sql`
            SELECT password
            FROM users
            WHERE id = ${user.id}
        `

        const verifyPassword = await bcrypt.compare(Password, getUser[0].password)

        if(!verifyPassword) {
            throw new BadRequestException('Wrong password')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await this.sql`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE id = ${user.id}
        `

        return 
    }

    async updateStudentInfo(user: UserType, body: updateStudentInfoDto) {
        const { education_level, year_level, course } = body

        const updatedStudentInfo = await this.sql`
            UPDATE users
            SET education_level = COALESCE(${education_level}, education_level),
                year_level = COALESCE(${year_level}, year_level),
                course = COALESCE(${course}, course)
            WHERE id = ${user.id}
            RETURNING *;
        `
        
        return updatedStudentInfo
    }

    async updateUserInfo(user: UserType, body: updateUserInfoDto) {
        const { name, email, username, branch } = body

        const updatedUserInfo = await this.sql`
            UPDATE users
            SET name = COALESCE(${name}, name),
                email = COALESCE(${email}, email),
                username = COALESCE(${username}, username),
                branch = COALESCE(${branch}, branch)
            WHERE id = ${user.id}
            RETURNING *;
        `
        
        return updatedUserInfo
    }
}
