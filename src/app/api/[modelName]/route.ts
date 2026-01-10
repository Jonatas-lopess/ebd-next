import Models from "@api/models";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@api/lib/apiError";

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
    const plan = req.headers.get("x-plan")!;
    const { modelName } = await params;
    const db = Models[modelName];
    let data = {};

    if (modelName !== "plans") data = { flag: plan };

    const result = await db.read({ data });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
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
    return handleApiError(err);
  }
}
