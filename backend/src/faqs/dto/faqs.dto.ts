import { IsString } from "class-validator";

export class CreateFaqsDto {
    @IsString()
    question: string;

    @IsString()
    answer: string;
}

export class UpdateFaqsDto extends CreateFaqsDto {}