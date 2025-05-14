import {
  AnyKeys,
  DeleteResult,
  Document,
  FilterQuery,
  HydratedDocument,
  PopulateOptions,
  ProjectionType,
  Types,
  UpdateQuery,
} from 'mongoose';
import { BaseEntity } from 'src/entities/base.entity';
import { EntityModel } from './types/mongoose';
import { plainToInstance } from 'class-transformer';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';

type QueryConfig<T> = {
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  projection?: ProjectionType<T>;
};

type DeleteCfg = {
  hardDelete?: boolean;
};

export class BaseRepository<
  T extends BaseEntity,
  TDocument extends Document = HydratedDocument<T>,
> {
  constructor(
    public entityModel: EntityModel<T, TDocument>,
    protected cfg?: {
      softDeletes?: boolean;
      type?: new () => T;
      prepareUpdateQuery?: (update: UpdateQuery<T>) => UpdateQuery<T>;
      overrideFn?: <TData extends AnyKeys<T>>(data: TData) => TData;
      queryOverrideFn?: (query?: FilterQuery<T>) => FilterQuery<T>;
      dataOverrideFn?: (data: AnyKeys<T>) => AnyKeys<T>;
    },
  ) {
    if (this.cfg?.overrideFn) {
      this.cfg.queryOverrideFn ??= this.cfg.overrideFn as any;
      this.cfg.dataOverrideFn ??= this.cfg.overrideFn;
    }
  }

  async find(
    query?: FilterQuery<T>,
    queryCfg?: QueryConfig<T> & { lean?: true },
  ): Promise<T[]>;
  async find(
    query?: FilterQuery<T>,
    queryCfg?: QueryConfig<T> & { lean: false },
  ): Promise<TDocument[]>;
  async find(
    query?: FilterQuery<T>,
    queryCfg?: QueryConfig<T> & { lean?: boolean },
  ) {
    query = this.prepareQuery(query);
    const model = this.entityModel.find(
      query,
      {},
      {
        populate: queryCfg?.populate,
        projection: queryCfg?.projection,
      },
    );

    if (queryCfg?.lean === false) {
      return model.exec();
    }

    return model
      .lean()
      .exec()
      .then((docs) => this.cast(docs));
  }

  async findOne(
    query?: FilterQuery<T>,
    queryCfg?: QueryConfig<T> & { lean?: true },
  ): Promise<T | null>;
  async findOne(
    query?: FilterQuery<T>,
    queryCfg?: QueryConfig<T> & { lean: false },
  ): Promise<TDocument | null>;
  async findOne(
    query?: FilterQuery<T>,
    queryCfg?: QueryConfig<T> & { lean?: boolean },
  ) {
    query = this.prepareQuery(query);
    const model = await this.entityModel.findOne(
      query,
      {},
      {
        populate: queryCfg?.populate,
        projection: queryCfg?.projection,
      },
    );
    if (queryCfg?.lean === false) {
      return model;
    }
    return model && this.cast(model.toObject());
  }

  async findOneById(
    id: string | Types.ObjectId,
    queryCfg?: QueryConfig<T> & { lean?: true },
  ): Promise<T | null>;
  async findOneById(
    id: string | Types.ObjectId,
    queryCfg?: QueryConfig<T> & { lean: false },
  ): Promise<TDocument | null>;
  async findOneById(
    id: string | Types.ObjectId,
    queryCfg?: QueryConfig<T> & { lean?: boolean },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    return this.findOne({ _id: id }, queryCfg as any) as Promise<any>;
  }

  async exists(query: FilterQuery<T>) {
    query = this.prepareQuery(query);
    const model = await this.entityModel.exists(query);
    return model;
  }

  async create(doc: AnyKeys<T>) {
    doc = this.prepareData(doc);
    const model = await this.entityModel.create(doc);
    const object = model.toObject();
    delete object?.password;
    delete object?.__v;
    return this.cast(object);
  }
  async updateOne(query: FilterQuery<T> = {}, doc: UpdateQuery<T>) {
    query = this.prepareQuery(query);
    doc = this.prepareData(doc);
    if (this.cfg?.prepareUpdateQuery) {
      doc = this.cfg.prepareUpdateQuery(doc);
    }
    const model = await this.entityModel.findOneAndUpdate(query, doc, {
      new: true,
    });
    this.assertFound(model);
    return this.cast(model!.toObject());
  }

  async updateOneById(id: string | Types.ObjectId, doc: UpdateQuery<T>) {
    const query = this.prepareQuery({ _id: id });
    doc = this.prepareData(doc);
    if (this.cfg?.prepareUpdateQuery) {
      doc = this.cfg.prepareUpdateQuery(doc);
    }
    const model = await this.entityModel.findOneAndUpdate(query, doc, {
      new: true,
    });
    this.assertFound(model);
    return this.cast(model!.toObject());
  }

  async updateMany(query: FilterQuery<T> = {}, doc: UpdateQuery<T>) {
    query = this.prepareQuery(query);
    doc = this.prepareData(doc);
    if (this.cfg?.prepareUpdateQuery) {
      doc = this.cfg.prepareUpdateQuery(doc);
    }
    const result = await this.entityModel.updateMany(query, doc);
    return result;
  }

  async deleteOne(query: FilterQuery<T> = {}, cfg?: DeleteCfg) {
    query = this.prepareQuery(query);
    if (this.cfg?.softDeletes && !cfg?.hardDelete) {
      await this.updateOne(query, { deletedAt: new Date() });
      return;
    }
    const result = await this.entityModel.deleteOne(query);

    if (!result.acknowledged || result.deletedCount < 1) {
      this.assertFound(null);
    }
  }

  async deleteOneById(id: string | Types.ObjectId, cfg?: DeleteCfg) {
    return this.deleteOne({ _id: id }, cfg);
  }

  async deleteMany(
    query: FilterQuery<T>,
    cfg?: DeleteCfg,
  ): Promise<DeleteResult> {
    query = this.prepareQuery(query);
    if (this.cfg?.softDeletes && !cfg?.hardDelete) {
      const result = await this.updateMany(query, { deletedAt: new Date() });
      return {
        deletedCount: result.modifiedCount,
        acknowledged: result.acknowledged,
      };
    }
    const result = await this.entityModel.deleteMany(query).exec();
    return result;
  }

  async countDocuments(query: FilterQuery<T> = {}) {
    query = this.prepareQuery(query);
    return this.entityModel.countDocuments(query).exec();
  }

  protected cast<TRaw>(result: TRaw[]): T[];
  protected cast<TRaw>(result: TRaw): T;
  protected cast<TResult>(result: TResult) {
    if (this.cfg?.type) {
      return plainToInstance(this.cfg.type, result);
    }
    return result;
  }

  protected prepareQuery(query: FilterQuery<T> = {}) {
    if (this.cfg?.queryOverrideFn) {
      query = this.cfg?.queryOverrideFn?.(query);
    }
    if (this.cfg?.softDeletes && !query.deletedAt) {
      query = {
        ...query,
        deletedAt: null,
      };
    }
    return query;
  }

  protected assertFound<K extends TDocument | null | undefined>(doc?: K) {
    if (doc == null) {
      throw new EntityNotFoundException(
        `${this.cfg?.type?.name ?? 'Entity'} not found`,
      );
    }
  }

  protected prepareData(doc: AnyKeys<T>) {
    if (this.cfg?.dataOverrideFn) {
      doc = this.cfg?.dataOverrideFn?.(doc);
    }
    return doc;
  }
}
