import Models from "@api/models";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ modelName: string }>;
};

export function generateStaticParams() {
  return Object.keys(Models).map((modelName) => ({
    modelName,
  }));
}

export const dynamicParams = false;

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { modelName } = await params;
    const db = Models[modelName];

    const result = await db.read();

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

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { modelName } = await params;
    const body = await req.json();
    const db = Models[modelName];

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
