import dbConnect from "@api/lib/dbConnect";
import GenericModelManager from "@api/services/databaseService";
import mongoose, { Schema, Types } from "mongoose";

interface IClass {
  name: string;
  group?: string;
  flag: Types.ObjectId;
  students?: Types.ObjectId[];
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    group: String,
    flag: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Register" }],
  },
  {
    strict: "throw",
  }
);

export default class Class extends GenericModelManager<IClass> {
  constructor() {
    super(
      mongoose.models.Classe || mongoose.model<IClass>("Classe", ClassSchema)
    );
  }

  async getIdentifiers() {
    await dbConnect();

    const distinctIds = await this.model.distinct<"_id", Types.ObjectId>("_id");
    return distinctIds as Types.ObjectId[];
  }
}
