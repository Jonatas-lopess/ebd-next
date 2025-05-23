import User, { IUser } from "@api/models/User";
import { HydratedDocument } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = new User();

    const user: HydratedDocument<IUser> = await db.create(body);

    return NextResponse.json(
      { message: "Sign up successfully.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
