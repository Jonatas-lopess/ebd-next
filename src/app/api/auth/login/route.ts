import Models from "@api/models";
import db from "@api/services/databaseService";
import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import { SignJWT } from "jose";
import { HydratedDocument } from "mongoose";
import { IUser } from "@api/models/User";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user: HydratedDocument<IUser> = await db.findOne({
      model: Models.users,
      data: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 422 }
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 422 }
      );
    }

    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

    return NextResponse.json(
      { message: "Logged in successfully.", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
