import { Schema } from "mongoose";

const registerSchema = new Schema({
  name: { type: String, required: true },
  idClass: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  aniversary: String,
  phone: String,
});

export default registerSchema;
