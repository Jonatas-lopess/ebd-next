import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import { SignJWT } from "jose";
import User from "@api/models/User";
import { HttpError, handleApiError } from "@api/lib/apiError";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required.");
    }

    const db = new User();

    const user = await db.getByEmail(email);

    if (!user) {
      throw new HttpError(422, "Invalid credentials.");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpError(422, "Invalid credentials.");
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
    return handleApiError(error);
  }
}
