import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationHistoryDto } from './create-operation-history.dto';

export class UpdateOperationHistoryDto extends PartialType(CreateOperationHistoryDto) {}