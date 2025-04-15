import mongoose, { Schema } from "mongoose";

const RegisterSchema = new Schema({
  name: { type: String, required: true },
  idClass: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  aniversary: String,
  phone: String,
});

const Register = mongoose.model("Register", RegisterSchema);

export default Register;
