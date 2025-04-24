import Models from "@api/models";
import { IUser } from "@api/models/User";
import db from "@api/services/databaseService";
import { HydratedDocument } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user: HydratedDocument<IUser> = await db.create({
      model: Models.users,
      data: body,
    });

    return NextResponse.json(
      { message: "Sign up successfully.", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
