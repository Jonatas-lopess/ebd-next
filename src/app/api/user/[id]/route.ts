import User from "@api/models/User";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = req.headers.get("x-userid")!;
    const { id } = await params;
    const db = new User();

    const user = await db.read({ id: userId });

    if (!user || user.role !== "owner") {
      throw new Error("Access denied.");
    }

    const deletedUser = await db.delete(id);

    return NextResponse.json(
      { message: "User deleted successfully.", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while processing your request.", error },
      { status: 500 }
    );
  }
}
