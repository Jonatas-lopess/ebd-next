import Rollcall from "@api/models/Rollcall";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = new Rollcall();

    if (!isValidObjectId(id)) throw new HttpError(400, "Invalid ID format.");

    const data = await db.read({ id });

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = new Rollcall();

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
    const db = new Rollcall();

    const data = await db.delete(id);

    return NextResponse.json(
      { message: "Rollcall deleted successfully.", deletedDocument: data },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
