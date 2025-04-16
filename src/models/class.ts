import mongoose, { Schema } from "mongoose";

const ClassSchema = new Schema({
  name: { type: String, required: true },
  group: String,
});

const Class = mongoose.models.Classe || mongoose.model("Classe", ClassSchema);

export default Class;
