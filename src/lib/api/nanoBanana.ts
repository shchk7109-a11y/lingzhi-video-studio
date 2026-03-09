import { guhighClient, getModelConfig } from "./guhighClient";

// 通过谷高中转 Nano Banana 生成分镜图
export async function generateSceneImage(imagePrompt: string): Promise<string> {
  const imageModel = await getModelConfig(
    "image_model_default",
    process.env.IMAGE_MODEL_DEFAULT || "gemini-3.1-flash-image-preview"
  );

  const response = await guhighClient.images.generate({
    model: imageModel,
    prompt: imagePrompt,
    n: 1,
    size: "1792x1024",
  });

  return response.data?.[0]?.url || "";
}
