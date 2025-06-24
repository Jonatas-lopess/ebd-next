import Rollcall from "@api/models/Rollcall";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const permittedParams = ["class", "lesson", "register"];
    const params = req.nextUrl.searchParams;
    const rollcall = new Rollcall();

    for (const key of params.keys()) {
      if (!permittedParams.includes(key)) {
        throw new Error(`Invalid query parameter: ${key}`);
      }

      if (Types.ObjectId.isValid(params.get(key) as string)) {
        throw new Error(`Invalid type of parameter: ${key}`);
      }
    }

    const data = await rollcall.read({
      data: {
        ...(params.has("register") && {
          "register.id": params.get("register"),
        }),
        ...(params.has("lesson") && { lesson: params.get("lesson") }),
        ...(params.has("class") && { "register.class": params.get("class") }),
      },
    });

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
