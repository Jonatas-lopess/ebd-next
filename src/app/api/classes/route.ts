import Class from "@api/models/Class";
import Lesson, { ILesson } from "@api/models/Lesson";
import { NextRequest, NextResponse } from "next/server";
import { HttpError, handleApiError } from "@api/lib/apiError";

export async function GET(req: NextRequest) {
  try {
    const plan = req.headers.get("x-plan")!;
    const lessonFilter = req.nextUrl.searchParams.get("lesson");
    let searchData: Object = { flag: plan };
    const db = new Class();

    if (lessonFilter) {
      const lesson = new Lesson();
      const lessonData: ILesson = await lesson.read({
        id: lessonFilter,
      });

      if (lessonData.flag.toString() !== plan)
        throw new HttpError(403, "Lesson does not belong to the specified plan.");

      lessonData &&
        lessonData.rollcalls &&
        (searchData = {
          _id: { $in: lessonData.rollcalls.map((l) => l.classId) },
        });
    }

    const result = await db.read({ data: searchData });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = new Class();

    const data = await db.create(body);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
