import Models from "@api/models";
import db from "@api/services/databaseService";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ modelName: string }>;
};

export function generateStaticParams() {
  const { users: _, ...rest } = Models;

  return Object.keys(rest).map((modelName) => ({
    modelName,
  }));
}

export const dynamicParams = false;

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { modelName } = await params;
    const data = await db.findAll(Models[modelName]);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { modelName } = await params;
    const body = await req.json();
    const data = await db.create({
      model: Models[modelName],
      data: body,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
