import User from "@api/models/User";
import { NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-userid");
    const db = new User();

    if (!userId) {
      throw new HttpError(400, "Error retrieving userId.");
    }

    const user = await db.read({ id: userId });

    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    return NextResponse.json(
      { message: "User data found successfully.", user },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
