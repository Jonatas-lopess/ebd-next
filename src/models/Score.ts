import mongoose, { Schema } from "mongoose";

interface IScore {
  title: string;
  type: string;
  weight: number;
}

const ScoreSchema = new Schema<IScore>({
  title: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
});

const Score: mongoose.Model<IScore> =
  mongoose.models.Score || mongoose.model<IScore>("Score", ScoreSchema);

export default Score;
