import { Injectable } from '@nestjs/common';
import { MaterialRepository } from './materials.repository';
import { CreateMaterialDto } from './dto/create-materila.dto';
import { Material } from 'src/entities/material.entity';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class MaterialsService {
  constructor(private readonly materialRepository: MaterialRepository) {}

  async createMaterial(materialData: CreateMaterialDto): Promise<Material> {
    return this.materialRepository.create(materialData);
  }

  async updateMaterial(
    materialId: string,
    materialData: UpdateMaterialDto,
  ): Promise<Material> {
    return this.materialRepository.updateOneById(materialId, materialData);
  }

  async deleteMaterial(materialId: string): Promise<Boolean> {
    this.materialRepository.deleteOneById(materialId);
    return true;
  }

  async getMaterials(query: FilterQuery<Material>): Promise<Material[]> {
    return this.materialRepository.find(query);
  }
}
