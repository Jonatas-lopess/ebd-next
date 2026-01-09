import User from "@api/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-userid");
    const db = new User();

    if (!userId) {
      return NextResponse.json(
        { message: "Error retrieving userId." },
        { status: 400 }
      );
    }

    const user = await db.read({ id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User data found successfully.", user },
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
