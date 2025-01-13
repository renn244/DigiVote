import { IsNumber, IsString } from "class-validator";

export class CreatePositionDto {
    @IsString()
    position: string;

    @IsString()
    description: string;

    @IsNumber()
    poll_id: number;
}