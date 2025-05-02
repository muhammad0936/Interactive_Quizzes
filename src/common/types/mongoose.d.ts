import { HydratedDocument, Model } from 'mongoose';

export type EntityModel<T, TDocument = HydratedDocument<T>> = Model<
  T,
  object,
  object,
  object,
  TDocument
>;
