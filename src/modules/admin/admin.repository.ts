// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../entities/admin.entity';
import { BaseRepository } from '../../common/base.repository';
import { UserType } from 'src/entities/enums/user-type.enum';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AdminRepository extends UserRepository<Admin>{
}