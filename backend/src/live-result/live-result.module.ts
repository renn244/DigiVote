import { Module } from '@nestjs/common';
import { LiveResultGateway } from './liveResult.gateway';

@Module({
    providers: [LiveResultGateway],
    exports: [LiveResultGateway]
})
export class LiveResultModule {}
