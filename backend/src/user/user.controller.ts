import { Body, Controller, Get, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { ChangePasswordDto, updateStudentInfoDto, updateUserInfoDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    async getUsers(@User() user: UserType) {
        return this.userService.getUsers(user);
    }

    @Get('getInitialUserInfo')
    async getInitialUserInfo(@User() user: UserType) {
        return this.userService.getInitialUserInfo(user);
    }

    @Patch('changeAvatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: multer.memoryStorage()
    }))
    async changeAvatar(@User() user: UserType, @UploadedFile() avatar: Express.Multer.File) {
        return this.userService.changeAvatar(user, avatar);
    }

    @Patch('changePassword')
    async changePassword(@User() user: UserType, @Body() body: ChangePasswordDto) {
        return this.userService.changePassword(user, body);
    }

    @Patch('updatedStudentInfo')
    async updateStudentInfo(@User() user: UserType, @Body() body: updateStudentInfoDto) {
        return this.userService.updateStudentInfo(user, body);
    }

    @Patch('updateUserInfo')
    async updateUserInfo(@User() user: UserType, @Body() body: updateUserInfoDto) {
        return this.userService.updateUserInfo(user, body);
    }
}
