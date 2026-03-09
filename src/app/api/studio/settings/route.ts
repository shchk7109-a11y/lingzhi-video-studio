import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const configs = await prisma.modelConfig.findMany();
    return NextResponse.json(configs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value, label } = await req.json();

    const config = await prisma.modelConfig.upsert({
      where: { configKey: key },
      create: { configKey: key, configValue: value, label },
      update: { configValue: value },
    });

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
