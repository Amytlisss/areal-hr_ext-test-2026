import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('hr-operations')
@UseGuards(AuthGuard('jwt'))
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) {}

  @Post()
  create(@Body() createHrOperationDto: CreateHrOperationDto) {
    const tempUserId = '00000000-0000-0000-0000-000000000000';
    return this.hrOperationsService.create(createHrOperationDto);
  }

  @Get()
  findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.hrOperationsService.findByEmployee(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hrOperationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHrOperationDto: UpdateHrOperationDto) {
    return this.hrOperationsService.update(id, updateHrOperationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.hrOperationsService.remove(id);
  }
}