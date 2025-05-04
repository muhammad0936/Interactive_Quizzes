import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';

@Schema({ collection: 'material' })
export class Material extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
