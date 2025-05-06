import mongoose, { Schema, Types } from "mongoose";
import { hashSync } from "bcrypt-ts";

export interface IUser {
  role: "teacher" | "admin";
  name: string;
  register: Types.ObjectId;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  role: { type: String, enum: ["teacher", "admin"], required: true },
  name: String,
  register: { type: Schema.Types.ObjectId, ref: "Register" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
