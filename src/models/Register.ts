import GenericModelManager from "@api/services/databaseService";
import mongoose, { Schema, Types } from "mongoose";
import Class from "./Class";

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

export default class Register extends GenericModelManager {
  constructor() {
    super(
      mongoose.models.Register ||
        mongoose.model<IRegister>("Register", RegisterSchema)
    );
  }

  async create({ data }: { data: IRegister }): Promise<any> {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (error) => {
        throw error;
      });

      const register = await this.model.create({
        ...data,
        class: {
          id: data.class.id,
          name: data.class.name,
          group: data.class.group,
        },
      });
      const _class = new GenericModelManager(Class);

      if (data.user === undefined) {
        await _class.update({
          id: data.class.id,
          data: {
            $push: { students: register._id },
          },
        });
      }

      return register;
    } finally {
      await mongoose.disconnect();
    }
  }
}
