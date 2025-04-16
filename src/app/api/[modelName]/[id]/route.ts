import Models from "@api/models";
import db from "@api/services/databaseService";
import capitalizeFirstLetter from "@api/utils/changeCaseFirstLetter";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ modelName: string; id: string }>;
};

type GenerateStaticParamsProps = {
  params: { modelName: string };
};

export async function generateStaticParams({
  params: { modelName },
}: GenerateStaticParamsProps) {
  const model = Models[capitalizeFirstLetter(modelName)];
  const data = await db.findAll(model);

  return data.map((item) => ({ id: item._id.toString() }));
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { modelName, id } = await params;
    const data = await db.findById({
      model: Models[capitalizeFirstLetter(modelName)],
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
      model: Models[capitalizeFirstLetter(modelName)],
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
    await db.remove({ model: Models[capitalizeFirstLetter(modelName)], id });

    return NextResponse.json(
      { message: `${modelName} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
