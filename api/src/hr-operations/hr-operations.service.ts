import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { HrOperation, OperationType } from './entities/hr-operation.entity';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { EmployeesService } from '../employees/employees.service';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/position.service';
import { OperationHistoryService } from '../operation-history/operation-history.service';
import { ObjectType } from '../operation-history/entities/operation-history.entity'; 

@Injectable()
export class HrOperationsService {
  constructor(
    @InjectRepository(HrOperation)
    private hrOperationRepository: Repository<HrOperation>,
    private employeesService: EmployeesService,
    private departmentsService: DepartmentsService,
    private positionsService: PositionsService,
    private operationHistoryService: OperationHistoryService,
  ) {}

  async create(createHrOperationDto: CreateHrOperationDto, userId?: string): Promise<HrOperation> {
    const employee = await this.employeesService.findOne(createHrOperationDto.employeeId);

    const isDismissed = await this.employeesService.isDismissed(createHrOperationDto.employeeId);

    if (isDismissed && createHrOperationDto.operationType !== OperationType.HIRE) {
      throw new BadRequestException(`Cannot create operations for dismissed employee (except hiring back)`);
    }

    if (createHrOperationDto.operationType === OperationType.HIRE) {
      if (!createHrOperationDto.departmentId || !createHrOperationDto.positionId) {
        throw new BadRequestException('При приеме на работу необходимо указать отдел и должность');
      }
      await this.departmentsService.findOne(createHrOperationDto.departmentId);
      await this.positionsService.findOne(createHrOperationDto.positionId);
    }

    if (createHrOperationDto.departmentId) {
      await this.departmentsService.findOne(createHrOperationDto.departmentId);
    }

    if (createHrOperationDto.positionId) {
      await this.positionsService.findOne(createHrOperationDto.positionId);
    }

    const hrOperation = this.hrOperationRepository.create(createHrOperationDto);
    const savedOperation = await this.hrOperationRepository.save(hrOperation);

     if (userId) {
      await this.operationHistoryService.logChange(
        userId,
        ObjectType.HR_OPERATION,
        savedOperation.id,
        'operation_type',
        null,
        savedOperation.operationType,
      );
    }

    return savedOperation;
  }

  async findAll(): Promise<HrOperation[]> {
    return this.hrOperationRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['employee', 'department', 'position'],
      order: { operationDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<HrOperation> {
    const hrOperation = await this.hrOperationRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['employee', 'department', 'position'],
    });
    if (!hrOperation) {
      throw new NotFoundException(`HR Operation with ID ${id} not found`);
    }
    return hrOperation;
  }

  async findByEmployee(employeeId: string): Promise<HrOperation[]> {
    await this.employeesService.findOne(employeeId);
    return this.hrOperationRepository.find({
      where: { employeeId, deletedAt: IsNull() },
      relations: ['department', 'position'],
      order: { operationDate: 'DESC' },
    });
  }

  async update(id: string, updateHrOperationDto: UpdateHrOperationDto): Promise<HrOperation> {
    const hrOperation = await this.findOne(id);
    Object.assign(hrOperation, updateHrOperationDto);
    hrOperation.updatedAt = new Date();
    return this.hrOperationRepository.save(hrOperation);
  }

  async remove(id: string): Promise<void> {
    const hrOperation = await this.findOne(id);
    hrOperation.deletedAt = new Date();
    await this.hrOperationRepository.save(hrOperation);
  }
}