import mongoose, { Schema, Types } from "mongoose";

interface IRegister {
  name: string;
  user?: Types.ObjectId;
  class: {
    id: Types.ObjectId;
    name: string;
    group?: string;
  };
  rollcalls?: Types.ObjectId[];
  aniversary?: string;
  phone?: string;
}

const ClassSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "Class" },
  name: { type: String, required: true },
  group: String,
});

const RegisterSchema = new Schema<IRegister>({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  class: ClassSchema,
  rollcalls: [{ type: Schema.Types.ObjectId, ref: "Rollcall" }],
  aniversary: String,
  phone: String,
});

const Register: mongoose.Model<IRegister> =
  mongoose.models.Register ||
  mongoose.model<IRegister>("Register", RegisterSchema);

export default Register;
