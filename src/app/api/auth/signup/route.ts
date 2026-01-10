import Plan, { IPlan } from "@api/models/Plan";
import Register, { IRegister } from "@api/models/Register";
import User, { IUser } from "@api/models/User";
import { SignJWT } from "jose";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

type RequestBody = {
  code: string;
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const reqBody: RequestBody = await req.json();
    const db = new User();
    const plan = new Plan();
    const register = new Register();
    let objToCreate: IUser | undefined = undefined;

    const [role, id] = Buffer.from(reqBody.code, "base64")
      .toString("utf-8")
      .split(":");

    if (role === "owner") {
      const planData: IPlan = await plan.read({ id });
      if (!planData || !planData.isActive || planData.superintendent)
        throw new HttpError(400, "Invalid plan or plan already has a superintendent.");

      objToCreate = {
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password,
        role: role,
        plan: new Types.ObjectId(id),
      };
    }

    if (role === "admin") {
      const planData: IPlan = await plan.read({ id });
      if (!planData || !planData.isActive) throw new HttpError(400, "Invalid plan.");

      objToCreate = {
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password,
        role: role,
        plan: new Types.ObjectId(id),
      };
    }

    if (role === "teacher") {
      const registerData = await register.read({ data: { user: id }, single: true });

      if (!registerData) throw new HttpError(400, "Register not found.");
      if (!registerData.class || !registerData.class.id)
        throw new HttpError(400, "Register does not have an associated class.");

      objToCreate = {
        _id: new Types.ObjectId(id),
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password,
        role: role,
        plan: registerData.flag,
        register: {
          id: registerData._id!,
          name: reqBody.name,
          class: registerData.class.id,
        },
      };
    }

    if (!objToCreate) throw new HttpError(400, "Invalid sign up code.");

    const user = await db.create(objToCreate);

    const token = await new SignJWT({ userId: user.id, plan: user.plan.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

    const { password: _, __v, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { message: "Sign up successfully.", token, user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
