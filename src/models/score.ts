import { Schema } from "mongoose";

const scoreSchema = new Schema({
  title: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
});

export default scoreSchema;
