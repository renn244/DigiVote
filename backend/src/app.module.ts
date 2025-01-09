import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailSenderModule } from './email-sender/email-sender.module';

// CONFIG MODULE NOT BEING LOADED FIRST!!!
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), EmailSenderModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
 
export class AppModule {
  constructor() {
    console.log(process.env.DATABASE_URL)
  }
}
