import mongoose, { Schema } from "mongoose";

interface IRegister {
  name: string;
  idClass: Schema.Types.ObjectId;
  aniversary?: string;
  phone?: string;
}

const RegisterSchema = new Schema<IRegister>({
  name: { type: String, required: true },
  idClass: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  aniversary: String,
  phone: String,
});

const Register: mongoose.Model<IRegister> =
  mongoose.models.Register ||
  mongoose.model<IRegister>("Register", RegisterSchema);

export default Register;
