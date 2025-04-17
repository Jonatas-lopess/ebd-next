import mongoose, { Schema } from "mongoose";

interface ILesson {
  title: string;
  date: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
});

const Lesson: mongoose.Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);

export default Lesson;
