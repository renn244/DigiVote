import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const jwtSecret = process.env.JWT_SECRET || '4aa2f3ceef6441f000e2f21b03a50fc560c2b18f633537d49766f782f474c42b';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpirations: false,
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: any) {
        return payload;
    }
}