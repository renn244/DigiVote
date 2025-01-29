import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';

@Module({
  providers: [PollService],
  controllers: [PollController],
  exports: [PollService]
})
export class PollModule {}
