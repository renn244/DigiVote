import { IsArray, IsDateString, IsEnum, IsString } from "class-validator";

export const vote_type = {
    single: "single",
    multiple: "multiple"
} as const;
export type vote_type = typeof vote_type[keyof typeof vote_type];

export class CreatePollDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsDateString()
    start_date: Date;

    
    @IsDateString()
    end_date: Date;

    @IsString()
    @IsEnum(vote_type)
    vote_type: string;

    @IsArray()
    @IsString({ each: true})
    allowed_education_levels: string[];

    @IsArray()
    @IsString({ each: true })
    allowed_courses: string[];
}
