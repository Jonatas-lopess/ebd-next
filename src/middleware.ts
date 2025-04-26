import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname === "/api/auth/login" ||
    req.nextUrl.pathname === "/api/auth/signup"
  ) {
    return NextResponse.next();
  }

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (token === undefined) {
      return NextResponse.json(
        {
          message:
            "You tried to access a protected resource without proper authentication.",
        },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );

    req.headers.set("userId", payload.userId as string);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "You tried to access a resource without permission or valid token.",
        error,
      },
      { status: 403 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
