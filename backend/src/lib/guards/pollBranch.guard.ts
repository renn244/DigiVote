import { Injectable, CanActivate, ExecutionContext, BadRequestException, Inject, NotFoundException, ForbiddenException, Type } from "@nestjs/common";


export const PollBranchGuard = (module: string, action: string): Type<CanActivate> => {
    @Injectable()
    class PollBranchGuard implements CanActivate {
        constructor(
            @Inject('POSTGRES_POOL') private readonly sql: any
        ) {}

        async canActivate(context: ExecutionContext):Promise<boolean> {
            const request = context.switchToHttp().getRequest();
            const user = request.user;

            if(!user) throw new Error('JwtAuthGuard is not applied!')

            // add all the different ways to get the pollId later
            const pollId = request.params.pollId || request.query.pollId || request.body.poll_id;
            console.log(request.body)
            if(!pollId) {
                throw new BadRequestException('pollId is required');
            }

            const getPoll = await this.sql`
                SELECT branch FROM poll
                WHERE id = ${pollId};
            `

            if(!getPoll.length) {
                throw new NotFoundException('Poll not found')
            }

            if(getPoll[0].branch !== user.branch) {
                throw new ForbiddenException(`only admin branch are allowed to ${action} ${module}`)
            }
            
            return true
        }
    }

    return PollBranchGuard;
}