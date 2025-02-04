import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CommunityQuestionsModule } from './community-questions/community-questions.module';
import { DatabaseModuleModule } from './database-module/database-module.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { FaqsModule } from './faqs/faqs.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PartiesModule } from './parties/parties.module';
import { PollModule } from './poll/poll.module';
import { PositionsModule } from './positions/positions.module';
import { UserModule } from './user/user.module';
import { VoteModule } from './vote/vote.module';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }), 
  CacheModule.register({
    isGlobal: true,
    ttl: 60 * 1000 //60 seconds
  }),
  EmailSenderModule, 
  AuthModule, 
  DatabaseModuleModule, PollModule, PartiesModule, FileUploadModule, PositionsModule, CandidatesModule, VoteModule, UserModule, FaqsModule, CommunityQuestionsModule
]

const isProduction = process.env.SOFTWARE_ENV

if(isProduction) {
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend', 'dist'),
    })
  )
}

@Module({
  imports: imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
  }
}
