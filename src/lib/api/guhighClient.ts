import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

// 所有国外模型统一走谷高中转，baseURL 替换即可，费用低于官方 40-50%
export const guhighClient = new OpenAI({
  apiKey: process.env.GUHIGH_API_KEY!,
  baseURL: process.env.GUHIGH_BASE_URL!,
});

// 从数据库动态读取模型配置，支持后台热切换无需重启
export async function getModelConfig(key: string, fallback: string): Promise<string> {
  try {
    const config = await prisma.modelConfig.findUnique({ where: { configKey: key } });
    return config?.configValue || fallback;
  } catch {
    return fallback;
  }
}
