import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly jwtService: JwtService,
        private readonly emailSender: EmailSenderService
    ) {}

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

    // jwt
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
            VALUES (${body.username}, ${name}, ${body.email}, ${hashedPassword}, ${branch});
        `

        return result[0]; 
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
            INSERT INTO emailVerify (email, code) VALUES (${email}, ${code});
        `

        // send email to user with code
        await this.emailSender.sendOtpEmail(result[0].email, code)

        return result[0]
    }

    async verifyEmail(token: string, email: string) {
        const getVerification = await this.sql`
            SELECT * FROM emailVerify WHERE email = ${email}
        `

        if(getVerification[0].code !== token) {
            throw new BadRequestException('Invalid Code!')
        }

        // create the user if the code is correct
        const getUser = await this.sql`
            SELECT * FROM userplaceholder WHERE email = ${email}
        `

        const user = getUser[0]

        const createUser = await this.sql`
            INSERT INTO users (username, name, email, password, branch)
            VALUES (user.username, user.name, user.email, user.password, user.branch)
        `

        return createUser[0] // maybe jwt?? so taht it is not needed to login
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
