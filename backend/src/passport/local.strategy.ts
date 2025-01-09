import { Strategy } from "passport-local";
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateUser({username, password});
        
        if(!user.user) {
            throw new BadRequestException({
                name: user.name,
                message: user.message
            })
        }
        
        return user.user;
    }
}
