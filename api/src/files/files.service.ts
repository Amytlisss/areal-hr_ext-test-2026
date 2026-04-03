import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private employeesService: EmployeesService,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async create(file: Express.Multer.File, employeeId: string): Promise<File> {
    await this.employeesService.findOne(employeeId);

    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(this.uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const fileEntity = this.fileRepository.create({
      employeeId,
      name: file.originalname,
      filePath: `/uploads/${fileName}`,
    });

    return this.fileRepository.save(fileEntity);
  }

  async findAllByEmployee(employeeId: string): Promise<File[]> {
    await this.employeesService.findOne(employeeId);
    return this.fileRepository.find({
      where: { employeeId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    
    const fullPath = path.join(process.cwd(), file.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    file.deletedAt = new Date();
    await this.fileRepository.save(file);
  }

  getFilePath(filePath: string): string {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }
    return fullPath;
  }
}