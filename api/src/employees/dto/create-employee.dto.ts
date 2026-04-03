import { IsString, IsOptional, IsDateString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
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

  @IsDateString()
  birthDate: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  passportSeries: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  passportNumber: string;

  @IsDateString()
  passportIssueDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  passportCode?: string;

  @IsString()
  @MaxLength(255)
  passportIssuedBy: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registrationRegion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registrationLocality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registrationStreet?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  registrationHouse?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  registrationBuilding?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  registrationApartment?: string;
}