import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ])

        if(isPublic) {
            // let everyone in, but still read the token when there is one
            // so the route knows who is asking (for example which answers you liked)
            await (super.canActivate(context) as Promise<boolean>).catch(() => false);
            return true;
        }

        return super.canActivate(context) as Promise<boolean>;
    }
}
