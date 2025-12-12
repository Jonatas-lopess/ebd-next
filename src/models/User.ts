import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import { hashSync } from "bcrypt-ts";
import GenericModelManager from "@api/services/databaseService";
import dbConnect from "@api/lib/dbConnect";
import Plan, { IPlan } from "./Plan";

export interface IUser {
  _id?: Types.ObjectId;
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
  recoveryToken?: string;
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
  recoveryToken: String,
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

  override async create(data: IUser): Promise<HydratedDocument<IUser>> {
    await dbConnect();
    const user = await this.model.create(data);

    if (user.role === "owner") {
      const plan = new Plan();

      await plan.update({
        id: user.plan,
        data: {
          superintendent: {
            id: user._id,
            name: user.name || "",
            email: user.email,
          } as IPlan["superintendent"],
        },
      });
    }

    return user;
  }

  async getByEmail(email: string): Promise<HydratedDocument<IUser> | null> {
    await dbConnect();

    return await this.model.findOne({ email }).select("+password");
  }
}
