import { IsNumber, IsString } from "class-validator";

export class CreatePartiesDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    poll_id: string;
}