import { NextResponse } from "next/server";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export function handleApiError(error: unknown) {
  // Log full error server-side for diagnostics
  console.error(error);

  if (error instanceof HttpError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  // Generic fallback (do not leak internal details in the response)
  return NextResponse.json(
    { message: "An error occurred while processing your request." },
    { status: 500 }
  );
}
