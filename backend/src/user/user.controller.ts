import { Body, Controller, Get, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { ChangePasswordAdminDto, ChangePasswordDto, getInTouchDto, updateStudentInfoDto, updateUserInfoAdmin, updateUserInfoDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AdminGuard } from 'src/lib/guards/admin.guard';
import { AdminUserBranchGuard } from 'src/lib/guards/AdminUserBranch.guard';
import { IsPublic } from 'src/lib/decorator/isPublic.decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @IsPublic()
    @Post('getInTouch')
    async getInTouch(@Body() body: getInTouchDto) {
        return this.userService.getInTouch(body)
    }

    @Get()
    async getUsers(@User() user: UserType, @Query() query: { page: string, search: string }) {
        return this.userService.getUsers(user, query);
    }

    @Get('getInitialUserInfo')
    async getInitialUserInfo(@User() user: UserType) {
        return this.userService.getInitialUserInfo(user.id);
    }

    @Get('getInitialUserInfoAdmin')
    async getInitialUserInfoAdmin(@Query('userId') userId: string) {
        return this.userService.getInitialUserInfo(userId);
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
        return this.userService.changeUserPassword(user, body);
    }

    @Patch('updatedStudentInfo')
    async updateStudentInfo(@User() user: UserType, @Body() body: updateStudentInfoDto) {
        return this.userService.updateStudentInfo(user, body);
    }

    @Patch('updateUserInfo')
    async updateUserInfo(@User() user: UserType, @Body() body: updateUserInfoDto) {
        return this.userService.updateUserInfo(user, body);
    }

    // for admin change
    @UseGuards(AdminGuard('userpassword', 'change'))
    @UseGuards(AdminUserBranchGuard)
    @Patch('changePasswordAdmin')
    async changePasswordAdmin(@Body() body: ChangePasswordAdminDto, @Query('userId') userId: string) {
        return this.userService.changePasswordAdmin(userId, body);
    }

    @UseGuards(AdminGuard('userInfo', 'change'))
    @UseGuards(AdminUserBranchGuard)
    @Patch('updateUserInfoAdmin')
    async updateUserInfoAdmin(@Body() body: updateUserInfoAdmin, @Query('userId') userId: string) {
        return this.userService.changeUserInfoAdmin(userId, body);
    }
}
