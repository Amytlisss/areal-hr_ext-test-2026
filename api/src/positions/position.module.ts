import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionsService } from "./position.service";
import { PositionController } from "./position.controller";
import { Position } from "./entities/position.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Position])],
    controllers:[PositionController],
    providers:[PositionsService],
    exports:[PositionsService],
})
export class PositionModule{}