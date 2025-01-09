import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/lib/guards/local-auth.guard';
import { RegistrationDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() body: RegistrationDto) {
        return this.authService.RegistrationUser(body)
    }

    @Post('verifyEmail')
    async verifyEmail(@Body() body: { token: string, email: string }) {
        return this.authService.verifyEmail(body.token, body.email)
    }

    @Post('resendEmail')
    async resendEmail(@Body() body: { email: string }) {
        return this.authService.resendEmail(body.email)
    }

    @Post('refreshToken')
    async refreshToken(@Body() body: any) {
        return this.authService.refreshToken(body.refreshToken)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('check')
    async checkUser(@User() user: UserType) {
        return this.authService.checkUser(user)
    }

}
