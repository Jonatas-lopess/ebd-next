import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { hashSync } from "bcrypt-ts";
import GenericModelManager from "@api/services/databaseService";
import dbConnect from "@api/lib/dbConnect";

export interface IUser {
  role: "teacher" | "admin" | "owner";
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

const registerSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Register" },
    name: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class" },
    aniversary: String,
    phone: String,
  },
  { strict: "throw", _id: false }
);

const UserSchema = new Schema<IUser>({
  role: { type: String, enum: ["teacher", "admin", "owner"], required: true },
  name: String,
  plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  register: registerSchema,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

export default class User extends GenericModelManager<IUser> {
  constructor() {
    super(mongoose.models.User || mongoose.model<IUser>("User", UserSchema));
  }

  async getByEmail(email: string): Promise<HydratedDocument<IUser> | null> {
    await dbConnect();

    return await this.model.findOne({ email }).select("+password");
  }
}
