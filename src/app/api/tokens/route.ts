import Plan from "@api/models/Plan";
import User from "@api/models/User";
import { NextRequest, NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

export async function GET(req: NextRequest) {
  try {
    const planId = req.headers.get("x-plan")!;
    const userId = req.headers.get("x-userid")!;
    const user = new User();
    const plan = new Plan();
    const typeParam = req.nextUrl.searchParams.get("type");

    if (!typeParam) {
      throw new HttpError(400, "Missing parameters.");
    }

    const planData = await plan.read({ id: planId });
    const userData = await user.read({ id: userId });

    if (!planData || !userData || planData.id !== userData.plan) {
      throw new HttpError(400, "Wrong parameters.");
    }

    if (
      typeParam === "administrator" &&
      userData._id !== planData.superintendent.id
    ) {
      throw new HttpError(403, "Permission denied.");
    }

    const result = {
      ...(typeParam === "teacher" && { teacherToken: planData.teacherToken }),
      ...(typeParam === "plan" && { planToken: planData.planToken }),
      ...(typeParam === "administrator" && {
        adminToken: planData.administratorToken,
      }),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
