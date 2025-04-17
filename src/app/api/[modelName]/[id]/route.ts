import Models from "@api/models";
import db from "@api/services/databaseService";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ modelName: string; id: string }>;
};

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const data = await db.findById({
      model: Models[modelName],
      id,
    });

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const body = await req.json();
    const data = await db.update({
      model: Models[modelName],
      id,
      data: body,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const data = await db.remove({
      model: Models[modelName],
      id,
    });

    return NextResponse.json(
      { message: `${modelName} deleted successfully.`, deletedDocument: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
