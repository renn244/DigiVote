import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { ChangePasswordDto, updateStudentInfoDto, updateUserInfoDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class UserService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly fileUploadService: FileUploadService
    ) {}

    async getUsers(user: UserType, query: { page: string, search: string }) {
        const limit = 12;
        const offset = ((parseInt(query.page) || 1) - 1) * limit;

        const users = await this.sql`
            SELECT id, name, student_id, year_level, course
            FROM users
            WHERE branch = ${user.branch}
            AND student_id ILIKE ${`%${query.search}%`}
            LIMIT ${limit} OFFSET ${offset}
        `;

        const hasNext = await this.sql`
            SELECT EXISTS(
                SELECT 1 FROM users
                WHERE branch = ${user.branch}
                AND student_id ILIKE ${`%${query.search}%`}
                OFFSET ${offset + limit}
            ) as has_next;
        `

        return {
            users: users,
            hasNext: hasNext[0].has_next
        }
    }

    // for settings page
    async getInitialUserInfo(user: UserType) {
        const getUser = await this.sql`
            SELECT name, email, username, branch,
                education_level, year_level, course, profile
            FROM users
            WHERE id = ${user.id}
        `

        return getUser[0]
    }

    async changeAvatar(user: UserType, avatar: Express.Multer.File) {
        
        const getUser = await this.sql`
            SELECT profile
            FROM users
            WHERE id = ${user.id}
        `

        if(getUser?.[0]?.profile) {
            await this.fileUploadService.deleteFile(getUser[0].profile)
        }

        const uploadResult = await this.fileUploadService.upload(avatar)

        const updatedAvatar = await this.sql`
            UPDATE users
            SET profile = ${uploadResult.secure_url}
            WHERE id = ${user.id}
            RETURNING profile;
        `

        if(!updatedAvatar.length) {
            throw new BadRequestException({
                name: 'avatar',
                message: 'Failed to update avatar'
            })
        }

        return updatedAvatar[0];
    }

    async changePassword(user: UserType, body: ChangePasswordDto) {
        const { currentPassword, newPassword, confirmPassword } = body

        if (newPassword !== confirmPassword) {
            throw new BadRequestException({
                name: 'confirmPassword',
                message: 'Password does not match'
            })
        }

        const getUser = await this.sql`
            SELECT password
            FROM users
            WHERE id = ${user.id}
        `

        const verifyPassword = await bcrypt.compare(currentPassword, getUser[0].password)

        if(!verifyPassword) {
            throw new BadRequestException({
                name: 'currentPassword', 
                message: 'Wrong password'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await this.sql`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE id = ${user.id}
        `

        return {
            message: 'Password changed successfully'
        }
    }

    async updateStudentInfo(user: UserType, body: updateStudentInfoDto) {
        const { education_level, year_level, course } = body

        const updatedStudentInfo = await this.sql`
            UPDATE users
            SET education_level = COALESCE(${education_level}, education_level),
                year_level = COALESCE(${year_level}, year_level),
                course = COALESCE(${course}, course)
            WHERE id = ${user.id}
            RETURNING education_level, year_level, course;
        `
        
        return updatedStudentInfo[0]
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
            RETURNING name, email, username, branch;
        `
        
        return updatedUserInfo[0]
    }
}
