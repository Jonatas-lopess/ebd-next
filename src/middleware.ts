import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      {
        message:
          "You tried to access a protected resource without proper authentication.",
      },
      { status: 401 }
    );
  }

  if (token !== "valid-token") {
    return NextResponse.json(
      { message: "You tried to access a resource without permission." },
      { status: 403 }
    );
  }

  NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
