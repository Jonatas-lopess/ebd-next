import mongoose from "mongoose";

type DatabaseParams = {
  id?: mongoose.Types.ObjectId | string;
  data?: mongoose.RootFilterQuery<any>;
};

interface IDatabaseService {
  readonly model: mongoose.Model<any>;
  create: (params: DatabaseParams) => Promise<any>;
  read: (params: DatabaseParams) => Promise<any>;
  update: (params: DatabaseParams) => Promise<any>;
  delete: (params: DatabaseParams) => Promise<any>;
}

export default class GenericModelManager implements IDatabaseService {
  readonly model: mongoose.Model<any>;

  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  async create({ data }: DatabaseParams) {
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

  async read({ id, data = {} }: DatabaseParams) {
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

  async update({ id, data }: DatabaseParams) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      if (id === undefined) throw new Error("Invalid identifier.");

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

  async delete({ id }: DatabaseParams) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      if (id === undefined) throw new Error("Invalid identifier.");

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
