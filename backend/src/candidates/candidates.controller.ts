import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/candidates.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
    constructor(
        private readonly candidatesService: CandidatesService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage()
    }))
    async createCandidate(@User() user: UserType, @Body() body: CreateCandidateDto, 
    @UploadedFile() photo: Express.Multer.File) {
        return this.candidatesService.createCandidate(user, body, photo);
    }

    @Get()
    async getCandidates(@Query('partyId') partyId: string) {
        return this.candidatesService.getCandidates(partyId);
    }

    @Get(':candidateId')
    async getCandidate(@Param('candidateId') candidateId: string) {
        return this.candidatesService.getCandidate(candidateId);
    }

    @Patch(':candidateId')
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage()
    }))
    async updateCandidate(@User() user: UserType, @Body() body: UpdateCandidateDto, 
    @Param('candidateId') candidateId: string, @UploadedFile() photo: Express.Multer.File | undefined) {
        return this.candidatesService.updateCandidate(user, body, candidateId, photo);
    }

    @Delete(':candidateId')
    async deleteCandidate(@User() user: UserType, @Param('candidateId') candidateId: string) {
        return this.candidatesService.deleteCandidate(user, candidateId);
    }
}
