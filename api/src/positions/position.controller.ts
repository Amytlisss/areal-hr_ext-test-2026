import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { PositionsService } from "./position.service";
import { CreatePositionDto } from "./dto/create-positions.dto";
import { UpdatePositionDto } from "./dto/update-position.dto";

@Controller("positions")
export class PositionController{
    constructor(private readonly positionsService:PositionsService){}

    @Post()
    create(@Body() createPositionDto:CreatePositionDto){
        return this.positionsService.create(createPositionDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
    }
    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePositionDto:UpdatePositionDto) {
        return this.positionsService.update(id, updatePositionDto);
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.positionsService.remove(id);
    }

}