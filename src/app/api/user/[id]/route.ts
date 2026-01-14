import User, { IUser } from "@api/models/User";
import { NextRequest, NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";
import Register from "@api/models/Register";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = req.headers.get("x-userid")!;
    const { id } = await params;
    const db = new User();
    const register = new Register();

    const user = await db.read({ id: userId });
    const userToDelete: IUser = await db.read({ id });

    if (!userToDelete) {
      throw new HttpError(404, "User to delete not found.");
    }

    if (!user || (userToDelete.role === "admin" && user.role !== "owner")) {
      throw new HttpError(403, "Access denied.");
    }

    const deletedUser = await db.delete(id);
    if (deletedUser.role === "teacher") {
      await register.update({
        id: deletedUser._id!,
        data: { user: undefined },
      });
    }

    return NextResponse.json(
      { message: "User deleted successfully.", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
