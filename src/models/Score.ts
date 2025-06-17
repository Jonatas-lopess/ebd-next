import GenericModelManager from "@api/services/databaseService";
import mongoose, { Schema, Types } from "mongoose";

interface IScore {
  title: string;
  flag: Types.ObjectId;
  type: "BooleanScore" | "NumberScore";
  weight: number;
}

const ScoreSchema = new Schema<IScore>(
  {
    title: { type: String, required: true },
    flag: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    type: {
      type: String,
      enum: ["BooleanScore", "NumberScore"],
      required: true,
    },
    weight: { type: Number, required: true },
  },
  { strict: "throw" }
);

export default class Score extends GenericModelManager<IScore> {
  constructor() {
    super(
      mongoose.models.Score || mongoose.model<IScore>("Score", ScoreSchema)
    );
  }
}
