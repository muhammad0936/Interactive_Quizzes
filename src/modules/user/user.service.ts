import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from 'src/common/base.service';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService<T extends User> extends BaseService<T> {
    constructor(protected readonly repository: UserRepository<T>) {
    super(repository);
  }

  
}
