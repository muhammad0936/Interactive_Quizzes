import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class GroupSummary {
  @Transform(({ value }) => (value as Types.ObjectId | string)?.toString())
  _id: string;
  name: string;
  studentCount: number;
}
