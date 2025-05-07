import mongoose, { Schema, Types } from "mongoose";

interface IClass {
  name: string;
  group?: string;
  flag: Types.ObjectId;
  students: Types.ObjectId[];
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true },
  group: String,
  flag: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Register" }],
});

const Class: mongoose.Model<IClass> =
  mongoose.models.Classe ||
  mongoose.model<IClass>("Class", ClassSchema, "classes");

export default Class;
