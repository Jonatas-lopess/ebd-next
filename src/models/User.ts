import mongoose, { Schema, Types } from "mongoose";
import { hashSync } from "bcrypt-ts";

export interface IUser {
  role: "teacher" | "admin";
  name?: string;
  plan: Types.ObjectId;
  register?: {
    id: Types.ObjectId;
    name: string;
    class: Types.ObjectId;
    aniversary?: string;
    phone?: string;
  };
  email: string;
  password: string;
}

const RegisterSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "Register" },
  name: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
  aniversary: String,
  phone: String,
});

const UserSchema = new Schema<IUser>({
  role: { type: String, enum: ["teacher", "admin"], required: true },
  name: String,
  plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  register: RegisterSchema,
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
