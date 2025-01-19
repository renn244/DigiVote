import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { CreatePositionDto } from './dto/positions.dto';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { AdminGuard } from 'src/lib/guards/admin.guard';
import { PollBranchGuard } from 'src/lib/guards/pollBranch.guard';

@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
    constructor(
        private readonly positionService: PositionsService
    ) {}

    @UseGuards(AdminGuard('positions', 'create'))
    @UseGuards(PollBranchGuard('positions', 'create'))
    @Post()
    async createPosition(@User() user: UserType, @Body() body: CreatePositionDto) {
        return this.positionService.createPositions(user, body);
    }

    @Get(':pollId')
    async getPosition(@Param('pollId') pollId: string) {
        return this.positionService.getPositions(pollId);
    }
    
    @Get('getPositionOptions/:pollId')
    async getPositionOptions(@Param('pollId') pollId: string) {
        return this.positionService.getPositionOptions(pollId)
    }

    @UseGuards(AdminGuard('positions', 'update'))
    @UseGuards(PollBranchGuard('positions', 'update'))
    @Patch(':positionId')
    async updatePosition(@User() user: UserType, @Body() body: CreatePositionDto, @Param('positionId') positionId: string) {
        return this.positionService.updatePosition(user, body, positionId)
    }

    @UseGuards(AdminGuard('positions', 'delete'))
    @UseGuards(PollBranchGuard('positions', 'delete'))
    @Delete(':positionId')
    async deletePosition(@User() user: UserType, @Param('positionId') positionId: string, @Query('pollId') pollId: string) {
        return this.positionService.deletePosition(user, positionId, pollId)
    }
}
