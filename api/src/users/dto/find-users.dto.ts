import { IsOptional, IsString, IsUUID, IsBooleanString } from 'class-validator';

export class FindUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsBooleanString()
  includeDeleted?: string;
}