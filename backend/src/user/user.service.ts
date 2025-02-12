import { BadRequestException, GoneException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { ChangePasswordAdminDto, ChangePasswordDto, getInTouchDto, updateStudentInfoDto, updateUserInfoAdmin, updateUserInfoDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class UserService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly fileUploadService: FileUploadService,
        private readonly emailSenderService: EmailSenderService
    ) {}

    // this is about the contact me
    async getInTouch(body: getInTouchDto) {
        if(!body.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/)) {
            throw new BadRequestException({
                name: 'email',
                message: 'email is invalid!'
            })
        }

        await this.emailSenderService.sendTextEmail(body.name, body.email, body.message)

        return {
            message: 'Successfully sent message!'
        }
    }

    async getUsers(user: UserType, query: { page: string, search: string }) {
        const limit = 9;
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
    async getInitialUserInfo(userId: string) {
        const getUser = await this.sql`
            SELECT name, email, username, branch,
                education_level, year_level, student_id, course, profile
            FROM users
            WHERE id = ${userId}
        `

        if(!getUser.length) {
            throw new NotFoundException()
        }

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

    async changePassword(userId: string, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const updatedPassword = await this.sql`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE id = ${userId}
            RETURNING password;
        `

        if(!updatedPassword.length) {
            throw new GoneException({
                name: 'password',
                message: 'Failed to update password'
            })
        }
        
        return {
            message: 'Password changed successfully'
        }
    }

    async changeUserPassword(user: UserType, body: ChangePasswordDto) {
        const { currentPassword, newPassword, confirmPassword } = body

        if (newPassword !== confirmPassword) {
            throw new BadRequestException({
                name: 'confirmPassword',
                message: 'Password does not match'
            })
        }

        // check if password is correct
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

        await this.changePassword(user.id, newPassword)
        
        return {
            message: 'Password changed successfully'
        }
    }

    async updateStudentInfo(user: UserType, body: updateStudentInfoDto) {
        if(user.role === 'admin') {
            throw new BadRequestException('admin does not have student information')
        }

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
        try {
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
        } catch (error) {
            if(error.code === '23505') {
                if(error.constraint === 'users_email_key') {
                    throw new BadRequestException({
                        name: 'email',
                        message: 'Email is already taken'
                    })
                } else if(error.constraint === 'users_username_key') {
                    throw new BadRequestException({
                        name: 'username',
                        message: 'Username is already taken'
                    })
                }
            }

            throw error
        }
    }

    // for admin change
    async changePasswordAdmin(userId: string, body: ChangePasswordAdminDto) {

        await this.changePassword(userId, body.password)
        
        return {
            message: 'Password changed successfully'
        }
    }


    async changeUserInfoAdmin(userId: string, body: updateUserInfoAdmin) {
        try {
            const { name, email, username, branch, education_level, year_level, course, student_id } = body

            const updatedUserInfo = await this.sql`
                UPDATE users
                SET name = COALESCE(${name}, name),
                    email = COALESCE(${email}, email),
                    username = COALESCE(${username}, username),
                    branch = COALESCE(${branch}, branch),
                    education_level = COALESCE(${education_level}, education_level),
                    year_level = COALESCE(${year_level}, year_level),
                    course = COALESCE(${course}, course),
                    student_id = COALESCE(${student_id}, student_id)
                WHERE id = ${userId}
                RETURNING name, email, username, branch, education_level, year_level, course, student_id;
            `
            
            return updatedUserInfo[0]
        } catch (error) {
            if(error.code === '23505') {
                if(error.constraint === 'users_email_key') {
                    throw new BadRequestException({
                        name: 'email',
                        message: 'Email is already taken'
                    })
                } else if(error.constraint === 'users_username_key') {
                    throw new BadRequestException({
                        name: 'username',
                        message: 'Username is already taken'
                    })
                } else if(error.constraint === 'users_student_id_key') {
                    throw new BadRequestException({
                        name: 'student_id',
                        message: 'Student ID is already taken'
                    })
                }
            }

            throw error
        }
    }
}
