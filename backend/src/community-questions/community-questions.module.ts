import { Module } from '@nestjs/common';
import { CommunityQuestionsController } from './community-questions.controller';
import { CommunityQuestionsService } from './community-questions.service';

@Module({
  controllers: [CommunityQuestionsController],
  providers: [CommunityQuestionsService]
})
export class CommunityQuestionsModule {}
