import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserRepository<T extends User> extends BaseRepository<T> {
  constructor(
    @InjectModel(User.name) model: Model<T>,
  ) {
    super(model);
  }

  async findByEmail(email: string): Promise<T | null> {
    return this.entityModel
      .findOne({ email, deletedAt: null })
      .select('-password')
      .exec();
  }

  async findByEmailWithPassword(email: string): Promise<T> {
    const user = await this.entityModel
      .findOne({ email })
      .select('+password')
      .exec();
    this.assertFound(user);
    return this.cast(user!.toObject());
  }
}