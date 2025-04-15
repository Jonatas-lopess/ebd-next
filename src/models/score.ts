import mongoose, { Schema } from "mongoose";

const ScoreSchema = new Schema({
  title: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
});

const Score = mongoose.model("Score", ScoreSchema);

export default Score;
