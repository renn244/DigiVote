import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { UserType } from 'src/lib/decorator/User.decorator';

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
            email: user.email
        }

        return {
            access_token: this.jwtService.sign(payload)
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
}
