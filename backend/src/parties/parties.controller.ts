import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { CreatePartiesDto } from './dto/parties.dto';
import { PartiesService } from './parties.service';

@UseGuards(JwtAuthGuard)
@Controller('parties')
export class PartiesController {
    constructor(
        private readonly partiesService: PartiesService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('banner', {
        storage: multer.memoryStorage()
    }))
    async createParties(@User() user: UserType, @Body() body: CreatePartiesDto, @UploadedFile() banner: Express.Multer.File) {
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

    @Patch(':partyId')
    @UseInterceptors(FileInterceptor('banner', {
        storage: multer.memoryStorage()
    }))
    async updateParty(@User() user: UserType, @Body() body: CreatePartiesDto, @Param('partyId') partyId: string,
    @UploadedFile() banner: Express.Multer.File | undefined) {
        return this.partiesService.updateParty(user, body, partyId, banner)
    }

    @Delete(':partyId')
    async deleteParty(@User() user: UserType, @Param('partyId') partyId: string) {
        return this.partiesService.deleteParty(user, partyId)
    }
}
