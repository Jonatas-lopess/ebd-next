import { Schema } from "mongoose";

const userSchema = new Schema({
  type: { type: String, enum: ["teacher", "admin"], required: true },
  name: String,
  idRegister: { type: Schema.Types.ObjectId, ref: "Register" },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default userSchema;
