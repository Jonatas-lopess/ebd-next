import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  type: { type: String, enum: ["teacher", "admin"], required: true },
  name: String,
  idRegister: { type: Schema.Types.ObjectId, ref: "Register" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

export default User;
