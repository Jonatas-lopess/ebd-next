import Register from "@api/models/register";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { RouteParams } from "@api/app/api/types";

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const { id } = await params;
    if (mongoose.isValidObjectId(id) === false)
      return NextResponse.json(
        { message: "Invalid identifier." },
        { status: 400 }
      );

    const document = await Register.findById(id);

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
    if (mongoose.isValidObjectId(id) === false)
      return NextResponse.json(
        { message: "Invalid identifier." },
        { status: 400 }
      );

    const req = await request.json();

    const document = await Register.findById(id);
    if (document === null)
      return NextResponse.json(
        { message: "Register not found." },
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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const { id } = await params;
    if (mongoose.isValidObjectId(id) === false)
      return NextResponse.json(
        { message: "Invalid identifier." },
        { status: 400 }
      );

    const document = await Register.findByIdAndDelete(id);
    if (document === null)
      return NextResponse.json(
        { message: "Register not found." },
        { status: 404 }
      );

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: error,
      },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}
