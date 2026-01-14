import User from "@api/models/User";
import { NextRequest, NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

export async function GET(req: NextRequest) {
  try {
    const plan = req.headers.get("x-plan")!;
    const userId = req.headers.get("x-userid")!;
    const db = new User();

    const user = await db.read({ id: userId });

    if (!user || user.role !== "owner") {
      throw new HttpError(403, "Unauthorized access.");
    }

    const data = await db.read({ data: { role: "admin", plan } });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
