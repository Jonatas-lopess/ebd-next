import { NextResponse } from "next/server";
import mongoose, { ConnectOptions } from "mongoose";

const options: ConnectOptions = {};

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, options);
    await mongoose.connection.db?.admin().command({ ping: 1 });

    return NextResponse.json({ message: "MongoDB connected successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "MongoDB connection failed", error },
      { status: 500 }
    );
  } finally {
    await mongoose.disconnect();
  }
}
