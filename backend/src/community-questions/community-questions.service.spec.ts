import { Test, TestingModule } from '@nestjs/testing';
import { CommunityQuestionsService } from './community-questions.service';

describe('CommunityQuestionsService', () => {
  let service: CommunityQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityQuestionsService],
    }).compile();

    service = module.get<CommunityQuestionsService>(CommunityQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
