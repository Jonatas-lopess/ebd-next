import User from "@api/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const plan = req.headers.get("plan")!;
    const userId = req.headers.get("userid")!;
    const db = new User();

    const user = await db.read({ id: userId });

    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const admins = await db.read({ data: { role: "admin", plan } });

    return NextResponse.json(
      { message: "Admins data found successfully.", admins },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
