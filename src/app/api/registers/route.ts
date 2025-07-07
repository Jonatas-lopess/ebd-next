import Register from "@api/models/Register";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const hasUser = req.nextUrl.searchParams.get("hasUser");
    const classFilter = req.nextUrl.searchParams.get("class");
    const db = new Register();

    const result = await db.read({
      data: {
        ...(hasUser === "true" && { user: { $exists: true, $ne: null } }),
        ...(hasUser === "false" && { user: { $exists: false } }),
        ...(classFilter && { "class.id": classFilter }),
      },
    });

    return NextResponse.json(result, { status: 200 });
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
    const body = await req.json();
    const db = new Register();

    const data = await db.create(body);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: {
          message: (err as Error).message,
          type: (err as Error).name,
          details: err,
        },
      },
      { status: 500 }
    );
  }
}
