import User, { IUser } from "@api/models/User";
import { NextRequest, NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";
import { compare } from "bcrypt-ts";
import Plan, { IPlan } from "@api/models/Plan";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-userid");
    const plan = req.headers.get("x-plan")!;
    const role = req.nextUrl.searchParams.get("role");
    const db = new User();

    if (!userId) {
      throw new HttpError(400, "Error retrieving userId.");
    }

    if (role && role !== "admin" && role !== "teacher")
      throw new HttpError(400, "Invalid parameter role.");
    if (role === "admin") {
      const requestingUser = await db.read({ id: userId });

      if (!requestingUser || requestingUser.role !== "owner") {
        throw new HttpError(403, "Unauthorized access.");
      }
    }

    const data = await db.read(
      role ? { data: { role, plan } } : { id: userId }
    );

    if (!data) {
      throw new HttpError(404, "Users not found.");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("x-userid");
    const planId = req.headers.get("x-plan")!;
    const { password } = await req.json();
    const db = new User();
    const plan = new Plan();

    if (!userId || !password || !planId)
      throw new HttpError(400, "Lack of required parameters.");

    const requestingUser: IUser = await db.read({ id: userId }, "+password");
    const planData: IPlan = await plan.read({ id: planId });

    if (!requestingUser) throw new HttpError(404, "Requesting user not found.");
    if (requestingUser.plan.toString() !== planId)
      throw new HttpError(403, "Unauthorized access.");
    if (
      requestingUser.role === "owner" &&
      planData.superintendent.id !== requestingUser._id
    )
      throw new HttpError(400, "Identifiers mismatch.");
    if (requestingUser.role === "owner" && planData.isActive)
      throw new HttpError(
        400,
        "Owner cannot be deleted while the plan is active. Contact support to delete the plan."
      );

    const isPasswordValid = await compare(password, requestingUser.password);

    if (!isPasswordValid) throw new HttpError(422, "Invalid credentials.");

    const deletedUser = await db.delete(userId);

    return NextResponse.json(
      { message: "User deleted successfully.", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
