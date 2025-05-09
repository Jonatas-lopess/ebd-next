import mongoose, { Schema, Types } from "mongoose";
import { hashSync } from "bcrypt-ts";
import GenericModelManager, {
  DatabaseParams,
} from "@api/services/databaseService";
import Register from "./Register";

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

const RegisterSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Register" },
    name: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class" },
    aniversary: String,
    phone: String,
  },
  { strict: "throw" }
);

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

export default class User extends GenericModelManager<IUser> {
  constructor() {
    super(mongoose.models.User || mongoose.model<IUser>("User", UserSchema));
  }

  override async create(data: IUser) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (err) => {
        throw err;
      });

      const user = await this.model.create(data);
      const register = new Register();

      if (data.register) {
        await register.update({
          id: data.register.id,
          data: {
            user: user._id,
          },
        });
      }

      return user;
    } finally {
      await mongoose.connection.close();
    }
  }
}
