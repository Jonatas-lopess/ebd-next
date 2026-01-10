import Register from "@api/models/Register";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const select = req.nextUrl.searchParams.get("select");
    const db = new Register();

    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid ID format.");

    const data = await db.read({ id }, select ?? undefined);

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = new Register();

    const data = await db.update({
      id,
      data: body,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = new Register();

    const data = await db.delete(id);

    return NextResponse.json(
      { message: `Register deleted successfully.`, deletedDocument: data },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
