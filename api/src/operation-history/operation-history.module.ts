import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationHistoryService } from './operation-history.service';
import { OperationHistoryController } from './operation-history.controller';
import { OperationHistory } from './entities/operation-history.entity';
//import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([OperationHistory]), ],//UsersModule,],
  controllers: [OperationHistoryController],
  providers: [OperationHistoryService],
  exports: [OperationHistoryService],
})
export class OperationHistoryModule {}