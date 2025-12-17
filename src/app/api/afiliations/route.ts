import Afiliation, { IAfiliation } from "@api/models/Afiliation";
import Plan, { IPlan } from "@api/models/Plan";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  type: "headquarter" | "branch";
  identifier: string;
};

export async function GET(req: NextRequest) {
  try {
    const plan = req.headers.get("plan")!;
    const db = new Afiliation();
    const planObj = new Plan();

    const planData: IPlan = await planObj.read({ id: plan });
    if (planData.headquarter) return NextResponse.json([], { status: 200 });

    const data = await db.read({ data: { idBranch: plan } });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: {
          message: (error as Error).message,
          type: (error as Error).name,
          details: error,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const planId = req.headers.get("plan")!;
    const { type, identifier }: RequestBody = await req.json();
    const db = new Afiliation();
    const plan = new Plan();

    if (type === "headquarter") {
      const planData: IPlan = await plan.read({ id: planId });
      if (planData.headquarter)
        throw new Error("You already have a headquarter.");

      const data: IAfiliation[] = await db.read({
        data: { idBranch: planId, idHeadquarter: identifier },
      });

      if (data.length === 0)
        throw new Error("Afiliation request not found for the given plan.");

      await plan.update({
        id: planId,
        data: { headquarter: new Types.ObjectId(identifier) },
      });
      await db.delete(data[0]._id!);
    }

    if (type === "branch") {
      const planData: IPlan[] = await plan.read({
        data: { planToken: identifier },
      });
      if (planData[0].headquarter)
        throw new Error("Given plan already have a headquarter.");

      await db.create({
        idBranch: new Types.ObjectId(planData[0]._id!),
        idHeadquarter: new Types.ObjectId(planId),
      });
    }

    return NextResponse.json(
      { message: "Action was successfull." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: {
          message: (error as Error).message,
          type: (error as Error).name,
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
