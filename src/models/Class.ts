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
    super(mongoose.models.Classe || mongoose.model("Classe", ClassSchema));
  }

  async getIdentifiers() {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (err) => {
        throw err;
      });

      return await this.model.distinct<"_id", Types.ObjectId>("_id");
    } finally {
      mongoose.connection.close();
    }
  }
}
