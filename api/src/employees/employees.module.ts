import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { HrOperation } from '../hr-operations/entities/hr-operation.entity';
import { OperationHistoryModule } from '../operation-history/operation-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, HrOperation]), OperationHistoryModule,],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}