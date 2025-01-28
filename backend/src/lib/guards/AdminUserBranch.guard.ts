import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from "@nestjs/common";

/**
 * This guard is used to check if the user is allowed to change the information of the user as an admin.
 *  through checking the branch of the user and the branch of the admin.
 */

@Injectable()
export class AdminUserBranchGuard implements CanActivate {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const adminUser = request.user;

        const otherUserId = request.query.userId || request.body.userId || request.params.userId;
        
        if(!adminUser) {
            throw new Error('JwtAuthGuard is not applied!');
        }

        const getUserBranch = await this.sql`
            SELECT branch from users
            WHERE id = ${otherUserId}
        ` 

        if(!getUserBranch.length) {
            throw new NotFoundException('User not found');
        }

        if(adminUser.branch !== getUserBranch[0].branch) {
            return false
        }

        return true;
    }
}
