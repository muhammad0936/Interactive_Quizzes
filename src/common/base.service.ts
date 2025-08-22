// base.service.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import {
  DeleteResult,
  FilterQuery,
  InferId,
  QueryWithHelpers,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { BaseEntity } from 'src/entities/base.entity';

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(createDto: any): Promise<T> {
    return this.repository.create(createDto);
  }

  async findAll(query: FilterQuery<T> = {}): Promise<T[]> {
    return this.repository.find(query);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOneById(id);
  }
  async exist(query: FilterQuery<T>) {
    return this.repository.exists(query);
  }

  async findOne(id: string, populate?: string): Promise<T | null> {
    return this.repository.findOne({ _id: id }, { populate });
  }

  async updateById(id: string, updates: UpdateQuery<T>): Promise<T | null> {
    return this.repository.updateOneById(id, updates);
  }

  async update(
    query: FilterQuery<T>,
    updates: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.repository.updateOne(query, updates);
  }

  async updateMany(
    query: FilterQuery<T>,
    updates: UpdateQuery<T>,
  ): Promise<UpdateWriteOpResult> {
    return this.repository.updateMany(query, updates);
  }

  async removeById(id: string): Promise<void> {
    return this.repository.deleteOneById(id);
  }
  async remove(query: FilterQuery<T>): Promise<void> {
    return this.repository.deleteOne(query);
  }
  async removeMany(query: FilterQuery<T>): Promise<DeleteResult> {
    return this.repository.deleteMany(query);
  }
  async count(query: FilterQuery<T>): Promise<number> {
    return this.repository.countDocuments(query);
  }
}
