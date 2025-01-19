import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { CreatePartiesDto } from './dto/parties.dto';
import { PartiesService } from './parties.service';
import { AdminGuard } from 'src/lib/guards/admin.guard';
import { PollBranchGuard } from 'src/lib/guards/pollBranch.guard';

@UseGuards(JwtAuthGuard)
@Controller('parties')
export class PartiesController {
    constructor(
        private readonly partiesService: PartiesService
    ) {}

    /**
     *  thee create, update and delete needs to have query for pollId
     *  because the guard needs to check if the user is in the same branch as the poll
     */

    @Post()
    @UseGuards(AdminGuard('parties', 'create'))
    @UseGuards(PollBranchGuard('parties', 'create'))
    @UseInterceptors(FileInterceptor('banner', {
        storage: multer.memoryStorage()
    }))
    async createParties(@User() user: UserType, @Body() body: CreatePartiesDto, @Query('pollId') pollId: string,
    @UploadedFile() banner: Express.Multer.File) {
        // the pollId is in the query is for the guard to check if the user is in the same branch as the poll
        return this.partiesService.createParties(user, body, banner)
    }

    @Get()
    async getParties(@User() user: UserType, @Query('pollId') pollId: string) {
        return this.partiesService.getParties(user, pollId)
    }

    @Get(':partyId')
    async getParty(@Param('partyId') partyId: string) {
        return this.partiesService.getParty(partyId)
    }

    @Get('getOverview/:partyId')
    async getOverviewParty(@Param('partyId') partyId: string) {
        return this.partiesService.getOverviewParty(partyId)
    }
    
    @Patch(':partyId')
    @UseInterceptors(FileInterceptor('banner', {
        storage: multer.memoryStorage()
    }))
    @UseGuards(AdminGuard('parties', 'update'))
    @UseGuards(PollBranchGuard('parties', 'update'))
    async updateParty(@User() user: UserType, @Body() body: CreatePartiesDto, @Param('partyId') partyId: string,
    @UploadedFile() banner: Express.Multer.File | undefined) {
        return this.partiesService.updateParty(user, body, partyId, banner)
    }

    @UseGuards(AdminGuard('parties', 'delete'))
    @UseGuards(PollBranchGuard('parties', 'delete'))
    @Delete(':partyId')
    async deleteParty(@User() user: UserType, @Param('partyId') partyId: string) {
        return this.partiesService.deleteParty(user, partyId)
    }
}
