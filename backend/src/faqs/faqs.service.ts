import { GoneException, Inject, Injectable } from '@nestjs/common';
import { CreateFaqsDto, UpdateFaqsDto } from './dto/faqs.dto';
import { UserType } from 'src/lib/decorator/User.decorator';

@Injectable()
export class FaqsService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}

    async createFaq(user: UserType, body: CreateFaqsDto) {
        const createdFaq = await this.sql`
            INSERT INTO faqs (question, answer, branch)
            VALUES (${body.question}, ${body.answer}, ${user.branch})
            RETURNING *;
        `

        if(!createdFaq.length) {
            throw new GoneException('Failed to create FAQ');
        }

        return createdFaq[0];
    }

    // implement search?
    async getFaqs() {
        const faqs = await this.sql`
            SELECT * FROM faqs;
        `

        return faqs;
    }

    async updateFaq(faqId: string, body: UpdateFaqsDto) {
        const updatedFaq = await this.sql`
            UPDATE faqs
            SET question = ${body.question}, answer = ${body.answer}
            WHERE id = ${faqId}
            RETURNING *;
        `

        if(!updatedFaq.length) {
            throw new GoneException('Failed to update FAQ');
        }

        return updatedFaq[0];
    }

    async deleteFaq(faqId: string) {
        const deletedFaq = await this.sql`
            DELETE FROM faqs
            WHERE id = ${faqId}
            RETURNING *;
        `

        if(!deletedFaq.length) {
            throw new GoneException('Failed to delete FAQ');
        }

        return deletedFaq[0];
    }
}
