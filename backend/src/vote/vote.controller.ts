import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { query } from 'express';

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

    @Get('getVoteElectionResult')
    async getVoteElectionResult(@User() user: UserType, @Query() query: { pollId: string }) {
        return this.voteService.getVoteElectionResult(user, query.pollId)
    }

    @Get('getVoteHistory')
    async getVoteHistory(@User() user: UserType, @Query() query: { page: string, search: string }) {
        return this.voteService.getVoteHistory(user, query);
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
