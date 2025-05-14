import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Material, MaterialSchema } from 'src/entities/material.entity';
import { MaterialRepository } from './materials.repository';

@Module({
  imports: [MongooseModule.forFeature([{name: Material.name, schema: MaterialSchema}])],
  providers: [MaterialsService, MaterialRepository],
  controllers: [MaterialsController]
})
export class MaterialsModule {}
