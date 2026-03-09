import { NextRequest, NextResponse } from "next/server";
import { getVideoTask } from "@/lib/api/klingVideo";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const data = await getVideoTask(params.taskId);

    // Normalize kling response to standard format
    const status = data.status === "succeed" ? "completed"
      : data.status === "failed" ? "failed"
      : "processing";

    return NextResponse.json({
      status,
      videoUrl: data.video_url || data.videos?.[0]?.url || null,
      raw: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
