import mongoose, { Schema } from "mongoose";

interface IClass {
  name: string;
  group?: string;
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true },
  group: String,
});

const Class: mongoose.Model<IClass> =
  mongoose.models.Classe ||
  mongoose.model<IClass>("Class", ClassSchema, "classes");

export default Class;
