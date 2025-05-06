import Models from "@api/models";
import { IUser } from "@api/models/User";
import GenericModelManager from "@api/services/databaseService";
import { HydratedDocument } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = new GenericModelManager(Models.users);

    const user: HydratedDocument<IUser> = await db.create({ data: body });

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
