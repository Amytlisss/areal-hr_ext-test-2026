import { IsUUID, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ObjectType } from '../entities/operation-history.entity';

export class CreateOperationHistoryDto {
  @IsUUID()
  userId: string;

  @IsEnum(ObjectType)
  objectType: ObjectType;

  @IsUUID()
  objectId: string;

  @IsString()
  @MaxLength(100)
  fieldName: string;

  @IsOptional()
  @IsString()
  oldValue?: string | null;

  @IsOptional()
  @IsString()
  newValue?: string | null;
}