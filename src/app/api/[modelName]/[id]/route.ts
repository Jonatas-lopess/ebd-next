import Models from "@api/models";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ modelName: string; id: string }>;
};

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const db = Models[modelName];

    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { message: "Invalid ID format." },
        { status: 400 }
      );

    const data = await db.read({ id });

    return NextResponse.json(data ?? {}, { status: 200 });
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

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const body = await req.json();
    const db = Models[modelName];

    const data = await db.update({
      id,
      data: body,
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

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const db = Models[modelName];

    const data = await db.delete(id);

    return NextResponse.json(
      { message: `${modelName} deleted successfully.`, deletedDocument: data },
      { status: 200 }
    );
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
