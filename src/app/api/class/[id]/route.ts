import classSchema from "@api/models/class";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { RouteParams } from "../types";

export async function GET({ params }: RouteParams) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const { id } = await params;
    const Class = mongoose.model("Classe", classSchema);

    const document = await Class.findById(id);

    return NextResponse.json(document ?? {}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const { id } = await params;
    const req = await request.json();
    const Class = mongoose.model("Classe", classSchema);

    const document = await Class.findById(id);
    if (document === null)
      return NextResponse.json(
        { message: "Class not found." },
        { status: 404 }
      );

    document.set(req);
    const data = await document.save();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}

export async function DELETE({ params }: RouteParams) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const { id } = await params;
    const Class = mongoose.model("Classe", classSchema);

    const document = await Class.findByIdAndDelete(id);
    if (document === null)
      return NextResponse.json(
        { message: "Class not found." },
        { status: 404 }
      );

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}
