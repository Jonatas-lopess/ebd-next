import { Schema } from "mongoose";

const classSchema = new Schema({
  name: { type: String, required: true },
  group: String,
});

export default classSchema;
