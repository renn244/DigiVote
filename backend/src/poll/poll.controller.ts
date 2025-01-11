import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { CreatePollDto } from './dto/poll.dto';

@UseGuards(JwtAuthGuard)
@Controller('poll')
export class PollController {
    constructor(
        private pollService: PollService
    ) {}

    @Post()
    async createPoll(@User() user: UserType, @Body() body: CreatePollDto) {
        return this.pollService.createPoll(user, body)
    }

    @Get()
    async getPolls(@User() user: UserType, @Query('search') search: string) {
        return this.pollService.getPolls(user, search)
    }

    @Get(':id')
    async getPoll(@User() user: UserType, @Param('id') pollId: string) {
        return this.pollService.getPoll(user, pollId)
    }

    @Patch(':pollId')
    async updatePoll(@User() user: UserType, @Param('pollId') pollId: string, @Body() body: CreatePollDto) {
        return this.pollService.updatePoll(user, pollId, body)
    }

    @Delete(':pollId')
    async deletePoll(@User() user: UserType, @Param('pollId') pollId: string) {
        return this.pollService.deletePoll(user, pollId)
    }
}
