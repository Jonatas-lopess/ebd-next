import mongoose from "mongoose";

type DatabaseParams = {
  model: mongoose.Model<any>;
  id?: any;
  data?: any;
};

const findAll = async (model: mongoose.Model<any>) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    mongoose.connection.on("error", (error) => {
      throw error;
    });

    const data = await model.find();

    return data;
  } catch (error) {
    throw new Error(`Error fetching in model: ${model.modelName}`, {
      cause: error,
    });
  } finally {
    await mongoose.disconnect();
  }
};

const findById = async ({ model, id }: DatabaseParams) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    mongoose.connection.on("error", (error) => {
      throw error;
    });

    if (mongoose.isValidObjectId(id) === false)
      throw new Error("Invalid identifier.");

    const document = await model.findById(id);

    return document;
  } catch (error) {
    throw new Error(`Error fetching in model: ${model.modelName}`, {
      cause: error,
    });
  } finally {
    await mongoose.disconnect();
  }
};

const create = async ({ model, data }: DatabaseParams) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    mongoose.connection.on("error", (error) => {
      throw error;
    });

    const document = await model.create(data);

    return document;
  } catch (error) {
    throw new Error(`Error creating in model: ${model.modelName}`, {
      cause: error,
    });
  } finally {
    await mongoose.disconnect();
  }
};

const update = async ({ model, id, data }: DatabaseParams) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    mongoose.connection.on("error", (error) => {
      throw error;
    });

    if (mongoose.isValidObjectId(id) === false)
      throw new Error("Invalid identifier.");

    const document = await model.findById(id);
    if (document === null) throw new Error(`${model.modelName} not found.`);

    document.set(data);
    const updatedDocument = await document.save();

    return updatedDocument;
  } catch (error) {
    throw new Error(`Error updating in model: ${model.modelName}`, {
      cause: error,
    });
  } finally {
    await mongoose.disconnect();
  }
};

const remove = async ({ model, id }: DatabaseParams) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    mongoose.connection.on("error", (error) => {
      throw error;
    });

    if (mongoose.isValidObjectId(id) === false)
      throw new Error("Invalid identifier.");

    const document = await model.findByIdAndDelete(id);
    if (document === null) throw new Error(`${model.modelName} not found.`);

    return document;
  } catch (error) {
    throw new Error(`Error deleting in model: ${model.modelName}`, {
      cause: error,
    });
  } finally {
    await mongoose.disconnect();
  }
};

const db = {
  findAll,
  findById,
  create,
  update,
  remove,
};

export default db;
