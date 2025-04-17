import mongoose, { Schema } from "mongoose";

interface ICall {
  idLesson: mongoose.Types.ObjectId;
  idRegister: mongoose.Types.ObjectId;
  isPresent?: boolean;
  score: {
    titleScore: string;
    value: string;
  }[];
}

const CallSchema = new Schema<ICall>({
  idLesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  idRegister: { type: Schema.Types.ObjectId, ref: "Register", required: true },
  isPresent: { type: Boolean, default: false },
  score: [
    {
      titleScore: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
});

const Call: mongoose.Model<ICall> =
  mongoose.models.Call || mongoose.model<ICall>("Call", CallSchema);

export default Call;
