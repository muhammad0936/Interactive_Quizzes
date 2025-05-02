import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model, {
      type: User,
    });
  }

  async findWithPassword(email: string) {
    const user = await this.entityModel
      .findOne({ email })
      .select('+password')
      .exec();

    this.assertFound(user);
    return this.cast(user!.toObject());
  }
}
