import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { HrOperation, OperationType } from '../hr-operations/entities/hr-operation.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(HrOperation)
    private hrOperationRepository: Repository<HrOperation>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async findAll(search?: string): Promise<Employee[]> {
    const whereCondition: any = { deletedAt: IsNull() };

    if (search && search.trim()) {
      whereCondition.lastName = Like(`%${search}%`);
    }

    const employees = await this.employeeRepository.find({
      where: whereCondition,
      relations: ['files', 'hrOperations'],
      order: { createdAt: 'DESC' },
    });

    const activeEmployees: Employee[] = [];
    for (const employee of employees) {
      const dismissed = await this.isDismissed(employee.id);
      if (!dismissed) {
        activeEmployees.push(employee);
      }
    }
    return activeEmployees;
  }

  async findAllWithDismissed(search?: string): Promise<Employee[]> {
    const whereCondition: any = { deletedAt: IsNull() };
    
    if (search && search.trim()) {
      whereCondition.lastName = Like(`%${search}%`);
    }
    
    return this.employeeRepository.find({
      where: whereCondition,
      relations: ['files', 'hrOperations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Employee & { isDismissed: boolean }> {
    const employee = await this.employeeRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['files', 'hrOperations'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    const isDismissed = await this.isDismissed(id);
    
    return { ...employee, isDismissed };
  }

  async isDismissed(employeeId: string): Promise<boolean> {
    const operations = await this.hrOperationRepository.find({
      where: { employeeId, deletedAt: IsNull() },
      order: { operationDate: 'DESC' },
    });
    
    if (operations.length === 0) return false;
    
    const lastOperation = operations[0];
    return lastOperation.operationType === OperationType.DISMISSAL;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    if (employee.isDismissed) {
      throw new BadRequestException(`Cannot update dismissed employee`);
    }
    Object.assign(employee, updateEmployeeDto);
    employee.updatedAt = new Date();
    return this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    employee.deletedAt = new Date();
    await this.employeeRepository.save(employee);
  }

  async dismiss(id: string): Promise<void> {
    const employee = await this.findOne(id);
    
    if (employee.isDismissed) {
      throw new BadRequestException(`Employee is already dismissed`);
    }

  return;
  }
}