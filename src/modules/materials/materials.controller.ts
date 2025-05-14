import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateMaterialDto } from './dto/create-materila.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FilterQuery } from 'mongoose';
import { Material } from 'src/entities/material.entity';

@Controller('materials')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class MaterialsController {

  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createMaterial(@Body() createMaterialDto:CreateMaterialDto){
    return await this.materialsService.createMaterial(createMaterialDto);
  }
  @Put(':materialId')
  @UseGuards(AdminGuard)
  async updateMaterial(@Body() updateMaterialDto: UpdateMaterialDto, @Param() {materialId}: {materialId: string}){
    console.log(materialId)
    return await this.materialsService.updateMaterial(materialId, updateMaterialDto);
  }

  @Delete(':materialId')
  @UseGuards(AdminGuard)
  async deleteMaterial(@Param() {materialId}: {materialId: string}){
    this.materialsService.deleteMaterial(materialId);
    return {message: "Material deleted."}
  }

  @Get()
  async getMaterials(@Query() query: FilterQuery<Material>){
    return this.materialsService.getMaterials(query);
  }

}
