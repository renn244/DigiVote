import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommunityQuestionsService } from './community-questions.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { CreateQuestionDto } from './dto/questions.dto';

@UseGuards(JwtAuthGuard)
@Controller('community-questions')
export class CommunityQuestionsController {
    constructor(
        private readonly communityQuestionsService: CommunityQuestionsService,
    ) {}

    @Post('createQuestion')
    async createCommunityQuestion(@User() user: UserType, @Body() body: CreateQuestionDto) {
        return this.communityQuestionsService.createCommunityQuestion(user, body);
    }

    @Get('getQuestions')
    async getCommunityQuestions() {
        return this.communityQuestionsService.getCommunityQuestions();
    }

    @Patch('updateQuestion/:questionId')
    async updateCommunityQuestion(@User() user: UserType, @Body() body: CreateQuestionDto, @Param('questionId') questionId: number) {
        return this.communityQuestionsService.updateCommunityQuestion(user, questionId, body);
    }

    @Delete('deleteQuestion/:questionId')
    async deleteCommunityQuestion(@User() user: UserType, @Param('questionId') questionId: number) {
        return this.communityQuestionsService.deleteCommunityQuestion(user, questionId);
    }
}
