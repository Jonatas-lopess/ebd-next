import GenericModelManager from "@api/services/databaseService";
import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import Class from "./Class";

interface ILesson {
  title?: string;
  date: Date;
  number: number;
  rollcalls?: {
    classId: Types.ObjectId;
    isDone: boolean;
  }[];
}

const LessonSchema = new Schema<ILesson>({
  title: String,
  date: { type: Date, required: true },
  number: { type: Number, required: true },
  rollcalls: [
    {
      classId: { type: Schema.Types.ObjectId, ref: "Class" },
      isDone: { type: Boolean, default: false },
    },
  ],
});

export default class Lesson extends GenericModelManager<ILesson> {
  constructor() {
    super(mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema));
  }

  override async create(data: ILesson) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (err) => {
        throw err;
      });

      const lesson: HydratedDocument<ILesson> = new this.model(data);
      const classes = new Class();
      const classIds = await classes.getIdentifiers();
      lesson.rollcalls = [];

      for (const classId of classIds) {
        lesson.rollcalls?.push({ classId, isDone: false });
      }

      return await lesson.save();
    } finally {
      mongoose.connection.close();
    }
  }
}
