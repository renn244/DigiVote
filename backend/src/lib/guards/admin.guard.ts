import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";

export const AdminGuard = (module: string, action: string) => {
    @Injectable()
    class AdminGuard implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const request = context.switchToHttp().getRequest();
            
            if(request.user.role !== 'admin') {
                throw new ForbiddenException(`only admin are allowed to ${action} ${module}`)
            }

            return true;
        }
    }

    return AdminGuard;
}