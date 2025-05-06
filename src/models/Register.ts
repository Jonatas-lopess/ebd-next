import mongoose, { Schema, Types } from "mongoose";

interface IRegister {
  name: string;
  user?: Types.ObjectId;
  class: Types.ObjectId;
  aniversary?: string;
  phone?: string;
}

const RegisterSchema = new Schema<IRegister>({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  aniversary: String,
  phone: String,
});

const Register: mongoose.Model<IRegister> =
  mongoose.models.Register ||
  mongoose.model<IRegister>("Register", RegisterSchema);

export default Register;
