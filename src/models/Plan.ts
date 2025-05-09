import GenericModelManager from "@api/services/databaseService";
import mongoose, { Schema, Types } from "mongoose";

interface IPlan {
  institution: string;
  superintendent: {
    id: Types.ObjectId;
    name: string;
    email: string;
  };
  headquarter?: Types.ObjectId;
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
}

const SuperintendentSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const PlanSchema = new Schema<IPlan>(
  {
    institution: { type: String, required: true },
    superintendent: SuperintendentSchema,
    headquarter: { type: Schema.Types.ObjectId, ref: "Plan" },
    price: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: "throw" }
);

export default class Plan extends GenericModelManager<IPlan> {
  constructor() {
    super(mongoose.models.Plan || mongoose.model("Plan", PlanSchema));
  }
}
