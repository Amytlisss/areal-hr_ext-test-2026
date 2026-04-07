import { Controller, Get, Param, Query } from '@nestjs/common';
import { OperationHistoryService } from './operation-history.service';
import { ObjectType } from './entities/operation-history.entity';

@Controller('operation-history')
export class OperationHistoryController {
  constructor(private readonly historyService: OperationHistoryService) {}

  @Get()
  findAll(@Query('employeeId') employeeId?: string) {
    if (employeeId) {
      return this.historyService.findByEmployee(employeeId);
    }
    return this.historyService.findAll();
  }

  @Get('object')
  findByObject(@Query('type') type: ObjectType, @Query('id') id: string) {
    return this.historyService.findByObject(type, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.findOne(id);
  }
}