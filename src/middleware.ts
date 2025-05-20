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

    const headers = new Headers(req.headers);
    headers.set("userid", payload.userId as string);

    const modifiedReq = new Request(req.url, {
      headers,
      body: req.body,
      method: req.method,
      redirect: req.redirect,
    });

    return NextResponse.next({ request: modifiedReq });
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
