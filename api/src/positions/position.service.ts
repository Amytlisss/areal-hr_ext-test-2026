import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { Position } from "./entities/position.entity";
import { CreatePositionDto} from "./dto/create-positions.dto";
import {UpdatePositionDto} from "./dto/update-position.dto";

@Injectable()
export class PositionsService{
    constructor(
        @InjectRepository(Position)
        private positionRepository:Repository<Position>,
    ){}

    async create(CreatePositionDto:CreatePositionDto):Promise<Position>{
        const position=this.positionRepository.create(CreatePositionDto);
        return this.positionRepository.save(position);
    }

    async findOne(id:string):Promise<Position>{
        const position=await this.positionRepository.findOne({
          where:{id, deletedAt:IsNull()},
        });
        if (!position){
          throw new NotFoundException("POsition with ID ${id} not found");
        }
        return position;
      }

    async update(id:string, updatePositionDto:UpdatePositionDto):Promise<Position>{
        const position=await this.findOne(id);
        Object.assign(position, updatePositionDto);
        position.updatedAt=new Date();
        return this.positionRepository.save(position);
    }

    async remove(id:string):Promise<void> {
        const position=await this.findOne(id);
        position.deletedAt=new Date();
        await this.positionRepository.save(position);
  }
}