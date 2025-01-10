import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { DatabaseModuleModule } from './database-module/database-module.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager'
import { PollModule } from './poll/poll.module';

// CONFIG MODULE NOT BEING LOADED FIRST!!!
@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }), 
  CacheModule.register({
    isGlobal: true,
    ttl: 60 * 1000 //60 seconds
  }),
  EmailSenderModule, 
  AuthModule, 
  DatabaseModuleModule, PollModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
 
export class AppModule {
  constructor() {
  }
}
