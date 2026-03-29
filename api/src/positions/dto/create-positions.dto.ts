import { IsString, MaxLength } from "class-validator";

export class CreatePositionDto {
    @IsString()
    @MaxLength(255)
    name: string;
}