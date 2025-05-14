// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material } from '../../entities/material.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class MaterialRepository extends BaseRepository<Material> {
  constructor(
    @InjectModel(Material.name) private readonly materialModel: Model<Material>,
  ) {
    super(materialModel);
  }

  // Add custom methods specific to Material
  async findByType(type: string): Promise<Material[]> {
    return this.materialModel.find({ type }).exec();
  }
}
