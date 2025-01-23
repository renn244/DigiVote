import { GoneException, Inject, Injectable } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { CreateQuestionDto, updateQuestionDto } from './dto/questions.dto';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';

@Injectable()
export class CommunityQuestionsService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
    ) {}

    async createCommunityQuestion(user: UserType, data: CreateQuestionDto) {
        
        const createdQuestion = await this.sql`
            INSERT INTO questions (question, asked_by_id)
            VALUES (${data.question}, ${user.id})
            RETURNING *;
        `

        if(!createdQuestion.length) {
            throw new GoneException('Failed to create question');
        }

        return createdQuestion[0];
    }

    async getCommunityQuestions() {
        // have pagination and search

        const questions = await this.sql`
            SELECT 
                q.id, 
                q.question, 
                asked_by_id, 
                u.username AS "askedBy", 
                q.created_at,
                COALESCE(
                    (
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', ans.id,
                                'answer', ans.answer,
                                'answered_by_id', ans.answered_by_id,
                                'question_id', ans.question_id,
                                'answeredBy', uans.username,
                                'likes', (
                                    SELECT COUNT(id)
                                    FROM likes
                                    WHERE answer_id = ans.id
                                ),
                                'created_at', ans.created_at
                            )
                        )
                        FROM answers ans
                        LEFT JOIN users uans ON ans.answered_by_id = uans.id
                        WHERE ans.question_id = q.id
                    ),
                    '[]'::json
                ) as answers
            FROM questions q
            LEFT JOIN users u ON q.asked_by_id = u.id;
        `

        return questions;
    }

    async updateCommunityQuestion(user: UserType, questionId: number, data: updateQuestionDto) {
        const updatedQuestion = await this.sql`
            UPDATE questions
            SET question = ${data.question}
            WHERE id = ${questionId} AND asked_by_id = ${user.id}
            RETURNING *;
        `

        if(!updatedQuestion.length) {
            throw new GoneException('Failed to update question');
        }

        return updatedQuestion[0];
    }

    async deleteCommunityQuestion(user: UserType, questionId: number) {
        const deletedQuestion = await this.sql`
            DELETE FROM questions
            WHERE id = ${questionId} AND asked_by_id = ${user.id}
            RETURNING *;
        `

        if(!deletedQuestion.length) {
            throw new GoneException('Failed to delete question');
        }

        return deletedQuestion[0];
    }

    // answers
    async createCommunityAnswer(user: UserType, questionId: number, data: CreateAnswerDto) {
        const createdAnswer = await this.sql`
            INSERT INTO answers (answer, question_id, answered_by_id)
            VALUES (${data.answer}, ${questionId}, ${user.id})
            RETURNING *;
        `

        if(!createdAnswer.length) {
            throw new GoneException('Failed to create answer');
        }

        return createdAnswer[0];
    }

    async updateCommunityAnswer(user: UserType, answerId: number, data: UpdateAnswerDto) {
        const updatedAnswer = await this.sql`
            UPDATE answers
            SET answer = ${data.answer}
            WHERE id = ${answerId} AND answered_by_id = ${user.id}
            RETURNING *;
        `

        if(!updatedAnswer.length) {
            throw new GoneException('Failed to update answer');
        }

        return updatedAnswer[0];
    }

    async deleteCommunityAnswer(user: UserType, answerId: string) {
        const deletedAnswer = await this.sql`
            DELETE FROM answers
            WHERE id = ${answerId} AND answered_by_id = ${user.id}
            RETURNING *;
        `

        if(!deletedAnswer.length) {
            throw new GoneException('Failed to delete answer');
        }

        return deletedAnswer[0];
    }
}
