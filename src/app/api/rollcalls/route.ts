import Rollcall from "@api/models/Rollcall";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

function isValidParameter(key: string, value: string): boolean {
  const permittedParams = ["class", "lesson", "register"];

  return (
    permittedParams.includes(key) &&
    ((key === "register" && value === "hasUser") ||
      Types.ObjectId.isValid(value))
  );
}

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const rollcall = new Rollcall();

    for (const key of Object.keys(params)) {
      if (!isValidParameter(key, params[key])) {
        throw new Error(`Invalid query parameter: ${key}`);
      }
    }

    const searchData: any = {
      ...(params["register"] &&
        (params["register"] === "hasUser"
          ? { "register.isTeacher": true }
          : { "register.id": params["register"] })),
      ...(params["lesson"] && { "lesson.id": params["lesson"] }),
      ...(params["class"] && { "register.class": params["class"] }),
    };

    const data = await rollcall.read({ data: searchData });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: {
          message: (error as Error).message,
          type: (error as Error).name,
          details: error,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const rollcall = new Rollcall();
    const body = await req.json();

    if (Array.isArray(body)) {
      const data = await rollcall.createMany(body);

      return NextResponse.json(data, { status: 201 });
    }

    const data = await rollcall.create(body);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: {
          message: (error as Error).message,
          type: (error as Error).name,
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
