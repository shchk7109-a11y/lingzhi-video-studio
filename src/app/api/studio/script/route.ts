import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guhighClient, getModelConfig } from "@/lib/api/guhighClient";
import { buildScriptPrompt } from "@/lib/prompts/scriptPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      videoType, productName, constitutions, solarTerm,
      targetAudience, purpose, customNotes, userId,
    } = body;

    const scriptModel = await getModelConfig(
      "script_model",
      process.env.SCRIPT_MODEL_DEFAULT || "gemini-3.1-flash"
    );

    const prompt = buildScriptPrompt({
      videoType, productName, constitutions,
      solarTerm, targetAudience, purpose, customNotes,
    });

    const completion = await guhighClient.chat.completions.create({
      model: scriptModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content || "{}";
    const scriptData = JSON.parse(raw);

    const project = await prisma.videoProject.create({
      data: {
        title: scriptData.title,
        videoType,
        productName,
        constitutions,
        solarTerm,
        targetAudience,
        purpose,
        customNotes,
        status: "script_done",
        scriptModel,
        createdBy: userId,
        scenes: {
          create: scriptData.scenes.map((s: any) => ({
            sceneNo:     s.sceneNo,
            duration:    s.durationSeconds,
            shotType:    s.shotType,
            visualDesc:  s.visualDesc,
            imagePrompt: s.imagePrompt,
            voiceover:   s.voiceover,
            subtitle:    s.subtitle,
            musicMood:   s.musicMood,
            avatarRole:  s.avatarRole,
          })),
        },
      },
      include: { scenes: { orderBy: { sceneNo: "asc" } } },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
