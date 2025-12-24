import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import { SignJWT } from "jose";
import User from "@api/models/User";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = new User();

    const user = await db.getByEmail(email);

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

    const token = await new SignJWT({ userId: user.id, plan: user.plan.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

    const { password: _, __v, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "Logged in successfully.",
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
