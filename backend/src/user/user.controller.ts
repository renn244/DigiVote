import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { ChangePasswordDto, updateStudentInfoDto, updateUserInfoDto } from './dto/user.dto';

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

    @Patch('changePassword')
    async changePassword(@User() user: UserType, body: ChangePasswordDto) {
        return this.userService.changePassword(user, body);
    }

    @Patch('updatedStudentInfo')
    async updateStudentInfo(@User() user: UserType, body: updateStudentInfoDto) {
        return this.userService.updateStudentInfo(user, body);
    }

    @Patch('updateUserInfo')
    async updateUserInfo(@User() user: UserType, body: updateUserInfoDto) {
        return this.userService.updateUserInfo(user, body);
    }
}
