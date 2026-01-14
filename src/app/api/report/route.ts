import Lesson from "@api/models/Lesson";
import Rollcall, { IRollcall } from "@api/models/Rollcall";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { handleApiError, HttpError } from "@api/lib/apiError";

type PostBody = {
  list: Array<IRollcall>;
  isFinished: boolean;
};

export async function POST(req: Request) {
  try {
    const plan = req.headers.get("x-plan")!;
    const rawData: PostBody = await req.json();
    const lessonId = rawData.list[0].lesson.id;
    const classId = rawData.list[0].register.class;
    const rollcall = new Rollcall();
    const lesson = new Lesson();

    const data = rawData.list;

    data.forEach((item) => {
      if (String(item.flag) !== plan) throw new HttpError(403, `Unauthorized action on item ${item._id}.`);
      if (String(item.lesson.id) !== lessonId.toString()) throw new HttpError(400, `Invalid lesson ID on item ${item._id}.`);
    });

    await rollcall.createMany(data);

    if (rawData.isFinished === false) {
      await lesson.update(
        {
          id: lessonId,
          data: {
            $set: { "rollcalls.$[elem].isDone": true },
          },
        },
        {
          arrayFilters: [{ "elem.classId": new Types.ObjectId(classId) }],
        }
      );
    }

    if (rawData.isFinished)
      await lesson.update({ id: lessonId, data: { isFinished: Date.now() } });

    return NextResponse.json(
      {
        message: "Report saved successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
