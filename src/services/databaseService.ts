import mongoose, { HydratedDocument, Types, Model } from "mongoose";

export type DatabaseParams<D = any> = {
  id?: Types.ObjectId | string;
  data?: D;
};

export interface IDatabaseService {
  readonly model: Model<any>;
  create: (data: any) => Promise<HydratedDocument<any>>;
  read: (params: DatabaseParams) => Promise<any>;
  update: (params: DatabaseParams) => Promise<any>;
  delete: (id: Types.ObjectId | string) => Promise<HydratedDocument<any>>;
}

export default class GenericModelManager<T> implements IDatabaseService {
  readonly model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  async create(data: T): Promise<HydratedDocument<T>> {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating in model: ${this.model.modelName}`, {
        cause: error,
      });
    } finally {
      await mongoose.disconnect();
    }
  }

  async read({
    id,
    data = {},
  }: DatabaseParams<mongoose.RootFilterQuery<T>>): Promise<any> {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      if (id) return await this.model.findById(id);

      return await this.model.find(data);
    } catch (error) {
      throw new Error(`Error fetching in model: ${this.model.modelName}`, {
        cause: error,
      });
    } finally {
      await mongoose.disconnect();
    }
  }

  async update({ id, data }: DatabaseParams<Object>): Promise<any> {
    if (id === undefined)
      throw new Error(`Error updating in model: ${this.model.modelName}`, {
        cause: "Invalid identifier.",
      });
    if (data === undefined) return null;

    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      const document = await this.model.findById(id);
      if (document === null)
        throw new Error(`${this.model.modelName} not found.`);

      document.set(data);
      return await document.save();
    } catch (error) {
      throw new Error(`Error updating in model: ${this.model.modelName}`, {
        cause: error,
      });
    } finally {
      await mongoose.disconnect();
    }
  }

  async delete(id: Types.ObjectId | string): Promise<HydratedDocument<T>> {
    if (id === undefined)
      throw new Error(`Error deleting in model: ${this.model.modelName}`, {
        cause: "Invalid identifier.",
      });

    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      const document = await this.model.findByIdAndDelete(id);
      if (document === null)
        throw new Error(`${this.model.modelName} not found.`);

      return document;
    } catch (error) {
      throw new Error(`Error deleting in model: ${this.model.modelName}`, {
        cause: error,
      });
    } finally {
      await mongoose.disconnect();
    }
  }
}
