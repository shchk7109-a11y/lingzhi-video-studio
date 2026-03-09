import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVideoTask } from "@/lib/api/klingVideo";

export async function POST(req: NextRequest) {
  try {
    const { sceneId, imageUrl, prompt } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "缺少分镜图 URL" }, { status: 400 });
    }

    const result = await createVideoTask({
      imageUrl,
      prompt,
      duration: 5,
      aspectRatio: "16:9",
    });

    const taskId = result.task_id;

    if (sceneId) {
      await prisma.videoScene.update({
        where: { id: sceneId },
        data: { videoStatus: "generating" },
      });
    }

    return NextResponse.json({ success: true, taskId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
