import 'multer';
import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as path from 'path';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:employeeId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('employeeId') employeeId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    return this.filesService.create(file, employeeId);
  }

  @Get('employee/:employeeId')
  async findByEmployee(@Param('employeeId') employeeId: string) {
    return this.filesService.findAllByEmployee(employeeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.findOne(id);
    const filePath = this.filesService.getFilePath(file.filePath);
    res.sendFile(path.resolve(filePath));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}