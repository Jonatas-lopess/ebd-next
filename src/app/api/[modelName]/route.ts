import Models from "@api/models";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ modelName: string }>;
};

export function generateStaticParams() {
  return Object.keys(Models).map((modelName) => ({
    modelName,
  }));
}

export const dynamicParams = false;

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { modelName } = await params;
    const body = await req.json();
    const db = Models[modelName];

    const data = await db.read({ data: body });

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
    const db = Models[modelName];

    const data = await db.create({ data: body });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
