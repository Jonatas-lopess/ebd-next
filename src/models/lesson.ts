import mongoose, { Schema } from "mongoose";

const LessonSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
});

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);

export default Lesson;
