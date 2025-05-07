import mongoose, { Schema, Types } from "mongoose";

interface ICall {
  register: Types.ObjectId;
  date: Date;
  number: number;
  isPresent?: boolean;
  score?: {
    kind: "BooleanScore" | "NumberScore";
    scoreInfo: Types.ObjectId;
    value: boolean | number;
  }[];
}

const scoreSchema = new Schema(
  { scoreInfo: { type: Schema.Types.ObjectId, ref: "Score" } },
  { discriminatorKey: "kind", _id: false }
);

const CallSchema = new Schema<ICall>({
  register: { type: Schema.Types.ObjectId, ref: "Register", required: true },
  date: { type: Date, required: true },
  number: { type: Number, required: true },
  isPresent: { type: Boolean, default: false },
  score: [scoreSchema],
});

const docArray = CallSchema.path<Schema.Types.DocumentArray>("score");

docArray.discriminator(
  "BooleanScore",
  new Schema({ value: { type: Boolean, required: true } }, { _id: false })
);

docArray.discriminator(
  "NumberScore",
  new Schema({ value: { type: Number, required: true } }, { _id: false })
);

const Call = mongoose.model<ICall>("Call", CallSchema);

export default Call;
