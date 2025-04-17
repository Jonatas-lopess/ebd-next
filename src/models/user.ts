import mongoose, { Schema } from "mongoose";

interface IUser {
  type: "teacher" | "admin";
  name: string;
  idRegister: mongoose.Types.ObjectId;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  type: { type: String, enum: ["teacher", "admin"], required: true },
  name: String,
  idRegister: { type: Schema.Types.ObjectId, ref: "Register" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
