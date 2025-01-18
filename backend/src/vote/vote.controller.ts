import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';

@UseGuards(JwtAuthGuard)
@Controller('vote')
export class VoteController {
    constructor(
        private readonly voteService: VoteService
    ) {}

    @Post()
    async createVote(@User() user: UserType, @Query('pollId') pollId: string,
    @Body() votes: { candidate_id: number }[]) {
        return this.voteService.createVote(user, pollId, votes);
    }

    @Get('getVotesStats')
    async getVotesStats(@User() user: UserType, @Query('partyId') partyId: string) {
        return this.voteService.getVotesStatistics(user, partyId);
    }

    @Get('getReviewVotes')
    async getReviewVotes(@User() user: UserType, @Query('pollId') pollId: string) {
        return this.voteService.getReviewVotes(user, pollId);
    }
}
