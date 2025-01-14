import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCandidateDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    party_id: string;

    @IsString()
    position_id: number;
}

export class UpdateCandidateDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsString()
    position_id: string
}