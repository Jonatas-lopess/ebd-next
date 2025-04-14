import { Schema } from "mongoose";

const callSchema = new Schema({
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

export default callSchema;
