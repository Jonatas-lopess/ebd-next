import Lesson from "@api/models/Lesson";
import Rollcall from "@api/models/Rollcall";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

type PostBody = {
  list: Array<any>;
  lesson: {
    id: string;
    number: number;
    date: Date;
    isFinished?: boolean;
  };
  class?: string;
};

export async function POST(req: Request) {
  try {
    const rawData: PostBody = await req.json();
    const lessonId = new Types.ObjectId(rawData.lesson.id);
    const rollcall = new Rollcall();
    const lesson = new Lesson();

    console.log(rawData); // Debugging line to check incoming data

    const data = rawData.list.map((e: any) => {
      const scoreArray = e.report.map((r: any) => {
        return {
          kind: typeof r.value === "boolean" ? "BooleanScore" : "NumberScore",
          scoreInfo: r.id,
          value: r.value,
        };
      });

      return {
        register: {
          id: new Types.ObjectId(e.id as string),
          name: e.name,
          class: new Types.ObjectId(e.class as string),
        },
        lesson: {
          id: lessonId,
          number: rawData.lesson.number,
          date: rawData.lesson.date,
        },
        isPresent: e.isPresent,
        score: scoreArray,
      };
    });

    await rollcall.createMany(data);

    if (rawData.class && rawData.lesson.isFinished !== true) {
      await lesson.update(
        {
          id: lessonId,
          data: {
            $set: { "rollcalls.$[elem].isDone": true },
          },
        },
        {
          arrayFilters: [{ "elem.classId": new Types.ObjectId(rawData.class) }],
        }
      );
    }

    if (rawData.lesson.isFinished)
      await lesson.update({ id: lessonId, data: { isFinished: true } });

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
