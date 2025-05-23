import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';

@Schema({ collection: 'material' })
export class Material extends BaseEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, min: 1, max: 5 })
  year?: Number;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
