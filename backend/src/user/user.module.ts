import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports: [FileUploadModule, EmailSenderModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
