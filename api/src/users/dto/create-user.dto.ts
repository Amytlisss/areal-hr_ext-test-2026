import { IsString, IsUUID, IsOptional, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsUUID()
  roleId: string;
}