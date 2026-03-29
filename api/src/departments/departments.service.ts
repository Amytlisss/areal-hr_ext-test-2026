import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { Department } from "./entities/department.entity";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { OrganizationsService } from "../organizations/organizations.service";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private organizationsService: OrganizationsService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    await this.organizationsService.findOne(createDepartmentDto.organizationId);

    if (createDepartmentDto.parentId) {
      const parent = await this.findOne(createDepartmentDto.parentId);
      if (parent.organizationId !== createDepartmentDto.organizationId) {
        throw new BadRequestException('Parent department must be in the same organization');
      }
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['organization', 'parent'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['organization', 'parent'],
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async findByOrganization(organizationId: string): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { organizationId, deletedAt: IsNull() },
      relations: ['parent'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);

    if (updateDepartmentDto.organizationId) {
      await this.organizationsService.findOne(updateDepartmentDto.organizationId);
    }

    if (updateDepartmentDto.parentId !== undefined) {
      if (updateDepartmentDto.parentId) {
        const parent = await this.findOne(updateDepartmentDto.parentId);
        const orgId = updateDepartmentDto.organizationId || department.organizationId;
        if (parent.organizationId !== orgId) {
          throw new BadRequestException('Parent department must be in the same organization');
        }
      }
    }

    Object.assign(department, updateDepartmentDto);
    department.updatedAt = new Date();
    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    department.deletedAt = new Date();
    await this.departmentRepository.save(department);
  }
}