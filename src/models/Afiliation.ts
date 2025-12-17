import GenericModelManager from "@api/services/databaseService";
import mongoose, { Schema, Types } from "mongoose";

export interface IAfiliation {
  _id?: Types.ObjectId;
  idBranch: Types.ObjectId;
  idHeadquarter: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const AfiliationSchema = new Schema<IAfiliation>(
  {
    idBranch: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    idHeadquarter: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

export default class Afiliation extends GenericModelManager<IAfiliation> {
  constructor() {
    super(
      mongoose.models.Afiliation ||
        mongoose.model<IAfiliation>("Afiliation", AfiliationSchema)
    );
  }
}
