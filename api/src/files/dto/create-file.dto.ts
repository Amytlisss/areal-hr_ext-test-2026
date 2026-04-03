import { IsUUID, IsString, MaxLength } from 'class-validator';

export class CreateFileDto {
  @IsUUID()
  employeeId: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(500)
  filePath: string;
}