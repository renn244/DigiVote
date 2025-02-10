import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { PollModule } from 'src/poll/poll.module';
import { LiveResultModule } from 'src/live-result/live-result.module';

@Module({
  imports: [PollModule, LiveResultModule],
  providers: [VoteService],
  controllers: [VoteController]
})
export class VoteModule {}
