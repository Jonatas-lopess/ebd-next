import GenericModelManager, {
  DatabaseParams,
} from "@api/services/databaseService";
import mongoose, { HydratedDocument, Schema, Types } from "mongoose";
import Register from "./Register";

interface IRollcall {
  register: Types.ObjectId;
  date: Date;
  number: number;
  isPresent?: boolean;
  score?: {
    kind: "BooleanScore" | "NumberScore";
    scoreInfo: Types.ObjectId;
    value: boolean | number;
  }[];
}

const scoreSchema = new Schema(
  { scoreInfo: { type: Schema.Types.ObjectId, ref: "Score" } },
  { discriminatorKey: "kind", _id: false }
);

const RollcallSchema = new Schema<IRollcall>(
  {
    register: { type: Schema.Types.ObjectId, ref: "Register", required: true },
    date: { type: Date, required: true },
    number: { type: Number, required: true },
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
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      mongoose.connection.on("error", (err) => {
        throw err;
      });

      const rollcall: HydratedDocument<IRollcall> = await this.model.create(
        data
      );
      const register = new Register();

      await register.update({
        id: rollcall.register,
        data: {
          $push: {
            rollcalls: { id: rollcall._id, isPresent: rollcall.isPresent },
          },
        },
      });

      return rollcall;
    } finally {
      await mongoose.connection.close();
    }
  }
}
