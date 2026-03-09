import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guhighClient, getModelConfig } from "@/lib/api/guhighClient";

export async function POST(req: NextRequest) {
  const { sceneId } = await req.json();

  const scene = await prisma.videoScene.findUnique({ where: { id: sceneId } });
  if (!scene) return NextResponse.json({ error: "场景不存在" }, { status: 404 });

  await prisma.videoScene.update({
    where: { id: sceneId },
    data: { imageStatus: "generating" },
  });

  try {
    const imageModel = await getModelConfig(
      "image_model_default",
      process.env.IMAGE_MODEL_DEFAULT || "gemini-3.1-flash-image-preview"
    );

    // 调用谷高中转 Nano Banana 生成分镜图
    const response = await guhighClient.images.generate({
      model: imageModel,
      prompt: scene.imagePrompt,
      n: 1,
      size: "1792x1024",
    });

    const imageUrl = response.data?.[0]?.url || "";

    await prisma.videoScene.update({
      where: { id: sceneId },
      data: { imageUrl, imageStatus: "done" },
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error: any) {
    await prisma.videoScene.update({
      where: { id: sceneId },
      data: { imageStatus: "failed", imageError: error.message },
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
