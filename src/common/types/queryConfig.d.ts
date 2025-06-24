export type QueryConfig<T> = {
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  projection?: ProjectionType<T>;
};
