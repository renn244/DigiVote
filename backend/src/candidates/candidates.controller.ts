import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/candidates.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CandidatesService } from './candidates.service';
import { AdminGuard } from 'src/lib/guards/admin.guard';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('candidates')
export class CandidatesController {
    constructor(
        private readonly candidatesService: CandidatesService
    ) {}

    @UseGuards(AdminGuard('candidates', 'create'))
    @Post()
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage()
    }))
    async createCandidate(@User() user: UserType, @Body() body: CreateCandidateDto, 
    @UploadedFile() photo: Express.Multer.File) {
        return this.candidatesService.createCandidate(user, body, photo);
    }

    @UseGuards(AdminGuard('candidates', 'get'))
    @Get()
    async getCandidates(@Query('partyId') partyId: string) {
        return this.candidatesService.getCandidates(partyId);
    }

    @UseGuards(AdminGuard('candidates', 'get'))
    @Get(':candidateId')
    async getCandidate(@Param('candidateId') candidateId: string) {
        return this.candidatesService.getCandidate(candidateId);
    }

    @UseGuards(AdminGuard('candidates', 'update'))
    @Patch(':candidateId')
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage()
    }))
    async updateCandidate(@User() user: UserType, @Body() body: UpdateCandidateDto, 
    @Param('candidateId') candidateId: string, @UploadedFile() photo: Express.Multer.File | undefined) {
        return this.candidatesService.updateCandidate(user, body, candidateId, photo);
    }

    @UseGuards(AdminGuard('candidates', 'delete'))
    @Delete(':candidateId')
    async deleteCandidate(@User() user: UserType, @Param('candidateId') candidateId: string) {
        return this.candidatesService.deleteCandidate(user, candidateId);
    }
}
