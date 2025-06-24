import dbConnect from "@api/lib/dbConnect";
import mongoose, { HydratedDocument, Types, Model } from "mongoose";

export type DatabaseParams<D = any> = {
  id?: Types.ObjectId | string;
  data?: D;
};

export interface IDatabaseService {
  readonly model: Model<any>;
  create: (data: any) => Promise<HydratedDocument<any>>;
  read: (params?: DatabaseParams, select?: string) => Promise<any>;
  update: (
    params: DatabaseParams,
    options?: mongoose.QueryOptions
  ) => Promise<any>;
  delete: (id: Types.ObjectId | string) => Promise<HydratedDocument<any>>;
}

export default class GenericModelManager<T> implements IDatabaseService {
  readonly model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  async create(data: T): Promise<HydratedDocument<T>> {
    await dbConnect();
    return await this.model.create(data);
  }

  async read(
    params?: DatabaseParams<mongoose.RootFilterQuery<T>>,
    select?: string
  ): Promise<any> {
    await dbConnect();

    if (params?.id) return await this.model.findById(params?.id);

    return await this.model.find(params?.data ?? {}, select);
  }

  async update(
    { id, data }: DatabaseParams<Object>,
    options?: mongoose.QueryOptions<T>
  ): Promise<any> {
    if (id === undefined)
      throw new Error(`Error updating in model: ${this.model.modelName}`, {
        cause: "Invalid identifier.",
      });
    if (data === undefined) return null;

    await dbConnect();

    const document = await this.model.findByIdAndUpdate(id, data, {
      ...options,
      new: true,
      runValidators: true,
    });

    if (document === null)
      throw new Error(`${this.model.modelName} not found.`);

    return document;
  }

  async delete(id: Types.ObjectId | string): Promise<HydratedDocument<T>> {
    if (id === undefined)
      throw new Error(`Error deleting in model: ${this.model.modelName}`, {
        cause: "Invalid identifier.",
      });

    await dbConnect();

    const document = await this.model.findByIdAndDelete(id);
    if (document === null)
      throw new Error(`${this.model.modelName} not found.`);

    return document;
  }
}
