import { BadRequestException, GoneException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { UserType } from 'src/lib/decorator/User.decorator';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, RegistrationDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly jwtService: JwtService,
        private readonly emailSender: EmailSenderService
    ) {}

    async checkUser(user: UserType) {
        // might want to get into the database later and cache if more data is needed
        return user
    }

    async validateUser(body: LoginDto) {
        const getUser = await this.sql`
            SELECT * FROM users 
            WHERE username = ${body.username}
        `

        if(getUser.length === 0) {
            return {
                user: null,
                name: 'username',
                message: 'username not found!'
            }
        }

        const verifyPassword = await bcrypt.compare(body.password, getUser[0].password)

        if(!verifyPassword) {
            return {
                user: null,
                name: 'password',
                message: 'wrong password!'
            }
        }

        return {
            user: getUser[0],
            name: '',
            message: 'Successfully Log In'
        }
    }

    async login(user: any) {
        const payload = {
            id: user.id,
            username: user.name,
            branch: user.branch,
            email: user.email,
            role: user.role
        }

        const access_token = this.jwtService.sign(payload, { expiresIn: '5m', secret: process.env.JWT_SECRET })
        const refresh_token = await this.generateRefreshToken(user.id)

        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    async RegistrationUser(body: RegistrationDto) {
        // check if email is valid
        const Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.sti\.edu\.ph$/;
        if(!Regex.test(body.email)) {
            throw new BadRequestException('Invalid email format');
        }

        const checkUsername = await this.sql`
            SELECT * FROM users WHERE username = ${body.username};
        `

        if(checkUsername[0]?.username === 'bodyUsername') {
            throw new BadRequestException('Username already exists');
        }

        const checkEmail = await this.sql`
            SELECT * FROM users WHERE email = ${body.email};
        `

        if(checkEmail[0]?.email === 'bodyEmail') {
            throw new BadRequestException('Email already exists');
        }

        const name = body.firstName + ' ' + body.lastName;
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const branch = body.email.split('@')[1].split('.')[0]

        const sendEmail = await this.createEmail(body.email);
        const result = await this.sql`
            INSERT INTO userplaceholder (username, name, email, password, branch) 
            VALUES (${body.username}, ${name}, ${body.email}, ${hashedPassword}, ${branch})
            RETURNING *;
        `

        if(!result.length) {
            throw new InternalServerErrorException('failed to create user try again')
        }

        return {
            success: true,
            message: 'successfully created account',
            next_action: 'redirect',
            redirect_url: `${process.env.CLIENT_BASE_URL}/verifyEmail?email=${result[0].email}`
        }
    }

    async createEmail(email: string) {
        const code = Math.floor(100000 + Math.random() * 900000); // generate 6 digit code

        const existingEmail = await this.sql`
            SELECT * FROM emailVerify WHERE email = ${email};
        `;

        if(existingEmail.length > 0) {
            throw new BadRequestException('Email verification already sent')
        }

        const result = await this.sql`
            INSERT INTO emailVerify (email, code) 
            VALUES (${email}, ${code})
            RETURNING *;
        `
        // send email to user with code
        await this.emailSender.sendOtpEmail(email, code)

        return result[0]
    }

    async verifyEmail(token: string, email: string) {
        const getVerification = await this.sql`
            SELECT * FROM emailVerify WHERE email = ${email}
        `

        // Check if a record was found
        if (!getVerification.length) {
            throw new BadRequestException('No verification record found for this email!');
        }

        if(getVerification[0].code !== token) {
            throw new BadRequestException('Invalid Code!')
        }
        
        // create the user if the code is correct
        const getUser = await this.sql`
            SELECT * FROM userplaceholder WHERE email = ${email}
        `

        if(!getUser.length) {
            throw new InternalServerErrorException('user is not defined!')
        }

        const user = getUser[0]

        const createUser = await this.sql`
            INSERT INTO users (username, name, email, password, branch)
            VALUES (${user.username}, ${user.name}, ${user.email}, ${user.password}, ${user.branch});
        `

        // delete placeholder and verifyUser
        const deleteVerifyEmail = await this.sql`
            DELETE FROM emailVerify 
            WHERE email = ${email};
        `
        const deleteUserPlaceholder = await this.sql`
            DELETE FROM userplaceholder
            WHERE id = ${user.id}
        `

        return {
            success: true,
            message: 'successfully verify email',
            next_action: 'redirect',
            redirect_url: `${process.env.CLIENT_BASE_URL}/login`
        }
    }

    async resendEmail(email: string) {
        const getVerificationEmail = await this.sql`
            SELECT * FROM emailVerify WHERE email = ${email}
        `

        if(getVerificationEmail.length === 0) {
            throw new NotFoundException('email not found on verifications')
        }

        const code = Math.floor(100000 + Math.random() * 900000); // generate 6 digit code
        const updateVerification = await this.sql`
            UPDATE emailverify 
            SET code = ${code}
            WHERE id = ${getVerificationEmail[0].id}
        ` 

        // send email
        await this.emailSender.sendOtpEmail(email, code)

        return "email has been resent"
    }

    async generateRefreshToken(userId: string) {
        if(!userId) {
            throw new GoneException('userId is undefined!')
        }

        const deleteRefreshToken = await this.sql`
            DELETE FROM refreshtokens 
            WHERE userid = ${userId}
        `

        const refreshToken = uuidv4()
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 28) // 4weeks 

        const saveRefreshtoken = await this.sql`
            INSERT INTO refreshtokens (userid, token, expiresAt)
            VALUES (${userId}, ${refreshToken}, ${expiresAt})
            RETURNING token;
        `

        if(!saveRefreshtoken.length) {
            throw new InternalServerErrorException('failed to create refresh token')
        }

        return saveRefreshtoken[0].token
    }

    // the one verifying for refresh token
    async refreshToken(refreshToken: string) {
        if(!refreshToken) {
            throw new GoneException({
                name: 'refreshToken',
                message: 'refresh toked does not exist'
            })
        }

        const getRefreshToken = await this.sql`
            SELECT * FROM refreshtokens
            WHERE token = ${refreshToken} 
            AND expiresat > ${new Date()}
        `

        // Handle case where no token is found
        if (!getRefreshToken.length) {
            throw new GoneException('Invalid or expired refresh token');
        }

        const user = await this.sql`
            SELECT * FROM users
            WHERE id = ${getRefreshToken[0].userid}
        `

        if(!user.length) {
            throw new InternalServerErrorException('failed to find user!')
        }

        return this.login(user[0])
    }
}
