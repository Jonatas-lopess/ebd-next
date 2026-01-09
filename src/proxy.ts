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
    const secret = process.env.JWT_SECRET;

    if (!token) {
      return NextResponse.json(
        {
          message:
            "You tried to access a protected resource without proper authentication.",
        },
        { status: 401 }
      );
    }

    if (!secret) {
      console.error("Missing JWT_SECRET environment variable in middleware");
      return NextResponse.json(
        { message: "Server misconfiguration: JWT secret missing." },
        { status: 500 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const headers = new Headers(req.headers);
    headers.set("x-userid", String((payload as any)?.userId ?? ""));
    headers.set("x-plan", String((payload as any)?.plan ?? ""));

    return NextResponse.next({ request: { headers } });
  } catch (error: any) {
    console.error("JWT verification failed:", error);

    const message = error?.message ?? "You tried to access a resource without permission or valid token.";
    
    return NextResponse.json(
      { message, error: String(error) },
      { status: 403 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
