import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { User, UserType } from 'src/lib/decorator/User.decorator';
import { AdminGuard } from 'src/lib/guards/admin.guard';
import { CreateFaqsDto } from './dto/faqs.dto';
import { FaqsService } from './faqs.service';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('faqs')
export class FaqsController {
    constructor(
        private readonly faqsService: FaqsService
    ) {}

    @UseGuards(AdminGuard('faqs', 'create'))
    @Post()
    async createFaq(@User() user: UserType, @Body() body: CreateFaqsDto) {
        return this.faqsService.createFaq(user, body);
    }

    @Get()
    async getFaqs() {
        return this.faqsService.getFaqs();
    }

    @UseGuards(AdminGuard('faqs', 'update'))
    @Patch(':faqId')
    async updateFaq(@Body() body: CreateFaqsDto, @Param('faqId') faqId: string) {
        return this.faqsService.updateFaq(faqId, body);
    }

    @UseGuards(AdminGuard('faqs', 'delete'))
    @Delete(':faqId')
    async deleteFaq(@Param('faqId') faqId: string) {
        return this.faqsService.deleteFaq(faqId);
    }
}