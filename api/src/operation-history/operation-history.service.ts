import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { OperationHistory, ObjectType } from './entities/operation-history.entity';
import { CreateOperationHistoryDto } from './dto/create-operation-history.dto';

@Injectable()
export class OperationHistoryService {
  constructor(
    @InjectRepository(OperationHistory)
    private historyRepository: Repository<OperationHistory>,
  ) {}

  async create(createHistoryDto: CreateOperationHistoryDto): Promise<OperationHistory> {
    const history = this.historyRepository.create(createHistoryDto);
    return this.historyRepository.save(history);
  }

  async logChange(
    userId: string,
    objectType: ObjectType,
    objectId: string,
    fieldName: string,
    oldValue: any,
    newValue: any,
  ): Promise<void> {
    if (oldValue === newValue) {
      return;
    }

    await this.create({
      userId,
      objectType,
      objectId,
      fieldName,
      oldValue: oldValue !== null && oldValue !== undefined ? String(oldValue) : null,
      newValue: newValue !== null && newValue !== undefined ? String(newValue) : null,
    });
  }

  async findAll(): Promise<OperationHistory[]> {
    return this.historyRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByObject(objectType: ObjectType, objectId: string): Promise<OperationHistory[]> {
    return this.historyRepository.find({
      where: { objectType, objectId, deletedAt: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OperationHistory> {
    const history = await this.historyRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });
    if (!history) {
      throw new NotFoundException(`History record with ID ${id} not found`);
    }
    return history;
  }
}