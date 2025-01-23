import { IsString } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    question: string;
}

export class updateQuestionDto extends CreateQuestionDto {}