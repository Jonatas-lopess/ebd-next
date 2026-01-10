import Register from "@api/models/Register";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@api/lib/apiError";

export async function GET(req: NextRequest) {
  try {
    const plan = req.headers.get("x-plan")!;
    const hasUser = req.nextUrl.searchParams.get("hasUser");
    const classFilter = req.nextUrl.searchParams.get("class");
    const db = new Register();

    const result = await db.read({
      data: {
        ...(hasUser === "true" && { user: { $exists: true, $ne: null } }),
        ...(hasUser === "false" && { user: { $exists: false } }),
        ...(classFilter && { "class.id": classFilter }),
        flag: plan,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const plan = req.headers.get("x-plan")!;
    const body = await req.json();
    const db = new Register();

    Object.assign(body, { flag: plan });

    const data = await db.create(body);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
