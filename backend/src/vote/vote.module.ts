import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { PollModule } from 'src/poll/poll.module';

@Module({
  imports: [PollModule],
  providers: [VoteService],
  controllers: [VoteController]
})
export class VoteModule {}
