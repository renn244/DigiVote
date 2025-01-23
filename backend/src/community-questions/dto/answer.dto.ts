import { IsString } from "class-validator";

export class CreateAnswerDto {
    @IsString()
    answer: string;
}

export class UpdateAnswerDto extends CreateAnswerDto {}