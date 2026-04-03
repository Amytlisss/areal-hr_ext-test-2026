import { IsString, IsOptional, IsUUID, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { OperationType } from '../entities/hr-operation.entity';

export class CreateHrOperationDto {
  @IsUUID()
  employeeId: string;

  @IsEnum(OperationType)
  operationType: OperationType;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  positionId?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsDateString()
  operationDate: string;
}