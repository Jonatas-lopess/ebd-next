import GenericModelManager from "@api/services/databaseService";
import mongoose, { Document, Schema, Types } from "mongoose";
import Class from "./Class";
import dbConnect from "@api/lib/dbConnect";

interface IRegister extends Document {
  name: string;
  user?: Types.ObjectId;
  class: {
    id: Types.ObjectId;
    name: string;
    group?: string;
  };
  rollcalls?: { id: Types.ObjectId; isPresent: boolean }[];
  aniversary?: string;
  phone?: string;
}

const classSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Class" },
    name: { type: String, required: true },
    group: String,
  },
  { _id: false, strict: "throw" }
);

const rollcallSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Rollcall" },
    isPresent: { type: Boolean, required: true },
  },
  { _id: false, strict: "throw" }
);

const RegisterSchema = new Schema<IRegister>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    class: classSchema,
    rollcalls: [rollcallSchema],
    aniversary: String,
    phone: String,
  },
  { strict: "throw" }
);

export default class Register extends GenericModelManager<IRegister> {
  constructor() {
    super(
      mongoose.models.Register ||
        mongoose.model<IRegister>("Register", RegisterSchema)
    );
  }

  override async create(data: IRegister) {
    if (Types.ObjectId.isValid(data.class.id) === false)
      throw new Error("Invalid class ID.");

    await dbConnect();

    const register = await this.model.create({
      ...data,
      class: {
        id: data.class.id,
        name: data.class.name,
        group: data.class.group,
      },
    });
    const _class = new Class();

    if (data.user === undefined) {
      await _class.update({
        id: data.class.id,
        data: {
          $push: { students: register._id },
        },
      });
    }

    return register;
  }
}
