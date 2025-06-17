import Rollcall from "@api/models/Rollcall";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawData: Array<any> = await req.json();
    const rollcall = new Rollcall();

    const data = rawData.map((e: any) => {
      const scoreArray = e.report.map((r: any) => {
        return {
          kind: typeof r.value === "boolean" ? "BooleanScore" : "NumberScore",
          scoreInfo: r.id,
          value: r.value,
        };
      });

      return {
        register: e.id,
        lesson: e.lesson,
        isPresent: e.isPresent,
        score: scoreArray,
      };
    });

    await rollcall.createMany(data);

    return NextResponse.json(
      {
        message: "Report saved successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: {
          message: (error as Error).message,
          type: (error as Error).name,
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
