import {IsString, IsOptional, MaxLength} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  comment?: string;
}