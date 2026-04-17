import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrOperationsService } from './hr-operations.service';
import { HrOperationsController } from './hr-operations.controller';
import { HrOperation } from './entities/hr-operation.entity';
import { EmployeesModule } from '../employees/employees.module';
import { DepartmentsModule } from '../departments/departments.module';
import { PositionModule } from '../positions/position.module';
import { OperationHistoryModule } from '../operation-history/operation-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HrOperation]),
    EmployeesModule,
    DepartmentsModule,
    PositionModule,
    OperationHistoryModule,
  ],
  controllers: [HrOperationsController],
  providers: [HrOperationsService],
  exports: [HrOperationsService],
})
export class HrOperationsModule {}