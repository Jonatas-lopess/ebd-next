import GenericModelManager from "@api/services/databaseService";
import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import dbConnect from "@api/lib/dbConnect";
import Register from "./Register";

export type ScoreType =
  | {
      kind: "BooleanScore";
      scoreInfo: Types.ObjectId;
      value: boolean;
    }
  | {
      kind: "NumberScore";
      scoreInfo: Types.ObjectId;
      value: number;
    };

export interface IRollcall {
  register: {
    id: Types.ObjectId;
    name: string;
    class: Types.ObjectId;
    isTeacher?: boolean;
  };
  lesson: {
    id: Types.ObjectId;
    number: number;
    date: Date;
  };
  isPresent?: boolean;
  flag: Types.ObjectId;
  score?: Array<ScoreType>;
}

const registerSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Register", required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    isTeacher: { type: Boolean, default: false },
  },
  { _id: false, versionKey: false }
);

const lessonSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    number: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { _id: false, versionKey: false }
);

const scoreSchema = new Schema(
  { scoreInfo: { type: Schema.Types.ObjectId, ref: "Score" } },
  { discriminatorKey: "kind", _id: false }
);

const RollcallSchema = new Schema<IRollcall>(
  {
    register: registerSchema,
    lesson: lessonSchema,
    flag: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    isPresent: { type: Boolean, default: false },
    score: [scoreSchema],
  },
  { strict: "throw" }
);

const docArray = RollcallSchema.path<Schema.Types.DocumentArray>("score");

docArray.discriminator(
  "BooleanScore",
  new Schema({ value: { type: Boolean, required: true } }, { _id: false })
);

docArray.discriminator(
  "NumberScore",
  new Schema({ value: { type: Number, required: true } }, { _id: false })
);

export default class Rollcall extends GenericModelManager<IRollcall> {
  constructor() {
    super(
      mongoose.models.Rollcall ||
        mongoose.model<IRollcall>("Rollcall", RollcallSchema)
    );
  }

  override async create(data: IRollcall) {
    if (Types.ObjectId.isValid(data.register.id) === false)
      throw new Error("Invalid register ID.");

    if (Types.ObjectId.isValid(data.register.class) === false)
      throw new Error("Invalid class ID.");

    if (Types.ObjectId.isValid(data.lesson.id) === false)
      throw new Error("Invalid lesson ID.");

    await dbConnect();

    const rollcall: HydratedDocument<IRollcall> = await this.model.create(data);
    const register = new Register();

    await register.update({
      id: rollcall.register.id,
      data: {
        $push: {
          rollcalls: { id: rollcall._id, isPresent: rollcall.isPresent },
        },
      },
    });

    return rollcall;
  }

  async createMany(data: IRollcall[]) {
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("No data provided for bulk insert.");

    if (data.some((r) => Types.ObjectId.isValid(r.register.id) === false))
      throw new Error("Invalid register ID in provided data.");

    await dbConnect();

    const docs = await this.model.insertMany(data);
    const register = new Register();

    if (docs.length === 0) {
      throw new Error("No rollcall documents were created.");
    }

    const updateRegistersPromise = docs.map((doc) =>
      register.update({
        id: doc.register.id,
        data: {
          $push: { rollcalls: { id: doc._id, isPresent: doc.isPresent } },
        },
      })
    );

    const updatedRegisters = await Promise.all(updateRegistersPromise);

    if (!updatedRegisters) {
      throw new Error("Failed to update registers with rollcalls.");
    }

    return docs;
  }
}
