import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { CreatePositionDto } from './dto/positions.dto';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
    constructor(
        private readonly positionService: PositionsService
    ) {}

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

    @Patch(':positionId')
    async updatePosition(@User() user: UserType, @Body() body: CreatePositionDto, @Param('positionId') positionId: string) {
        return this.positionService.updatePosition(user, body, positionId)
    }

    @Delete(':positionId')
    async deletePosition(@User() user: UserType, @Param('positionId') positionId: string, @Query('pollId') pollId: string) {
        return this.positionService.deletePosition(user, positionId, pollId)
    }
}
