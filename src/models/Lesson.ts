import GenericModelManager from "@api/services/databaseService";
import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import Class from "./Class";
import dbConnect from "@api/lib/dbConnect";

interface ILesson {
  title?: string;
  date: Date;
  flag: Types.ObjectId;
  number: number;
  rollcalls?: {
    classId: Types.ObjectId;
    isDone: boolean;
  }[];
  isFinished?: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: String,
  date: { type: Date, required: true },
  flag: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  number: { type: Number, required: true },
  rollcalls: [
    {
      classId: { type: Schema.Types.ObjectId, ref: "Class" },
      isDone: { type: Boolean, default: false },
      _id: false,
    },
  ],
  isFinished: Date,
});

export default class Lesson extends GenericModelManager<ILesson> {
  constructor() {
    super(
      mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema)
    );
  }

  override async create(data: ILesson) {
    await dbConnect();

    const lesson: HydratedDocument<ILesson> = new this.model(data);
    const classes = new Class();
    const classIds = await classes.getIdentifiers();
    lesson.rollcalls = [];

    for (const classId of classIds) {
      lesson.rollcalls?.push({ classId, isDone: false });
    }

    return await lesson.save();
  }
}
