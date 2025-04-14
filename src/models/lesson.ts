import { Schema } from "mongoose";

const lessonSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
});

export default lessonSchema;
