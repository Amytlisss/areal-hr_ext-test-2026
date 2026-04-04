import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import{OrganizationsModule} from "./organizations/organizations.module";
import { DepartmentsModule } from './departments/departments.module';
import { PositionModule } from './positions/position.module';
import { EmployeesModule } from './employees/employees.module';
import { FilesModule } from './files/files.module';
import { HrOperationsModule } from './hr-operations/hr-operations.module';
import { OperationHistoryModule } from './operation-history/operation-history.module';
@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService)=>({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname+ '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
      inject:[ConfigService],
    }),
    OrganizationsModule,
    DepartmentsModule,
    PositionModule,
    EmployeesModule,
    FilesModule,
    HrOperationsModule,
    OperationHistoryModule,
  ],
})
export class AppModule {}
