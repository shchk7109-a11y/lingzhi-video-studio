import axios from "axios";

const client = axios.create({
  baseURL: process.env.KLING_BASE_URL,
  headers: { Authorization: `Bearer ${process.env.KLING_API_KEY}` },
});

// 图生视频（用分镜图 + prompt 生成视频片段）
export async function createVideoTask(params: {
  imageUrl: string;
  prompt: string;
  duration?: 5 | 10;
  aspectRatio?: "16:9" | "9:16";
}) {
  const res = await client.post("/videos/image2video", {
    image_url: params.imageUrl,
    prompt: params.prompt,
    duration: params.duration || 5,
    aspect_ratio: params.aspectRatio || "16:9",
    mode: "std",
  });
  return res.data; // { task_id }
}

// 轮询任务状态
export async function getVideoTask(taskId: string) {
  const res = await client.get(`/videos/${taskId}`);
  return res.data; // { status, video_url }
}
