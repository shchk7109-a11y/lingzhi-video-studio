// 体质视觉风格词（用于 imagePrompt 构建）
export const CONSTITUTION_VISUAL: Record<string, string> = {
  "气虚质": "soft morning light, warm beige tones, gentle cozy indoor, steaming herbal drink",
  "阳虚质": "warm golden sunlight, amber tones, cozy winter setting, steaming herbal tea",
  "阴虚质": "cool blue-green tones, diffused light, bamboo elements, refreshing clean atmosphere",
  "痰湿质": "fresh green tones, open airy space, natural outdoor, clean minimalist",
  "湿热质": "cool white-green palette, bamboo, clean modern space, cooling herbs",
  "血瘀质": "warm rose-red tones, flowing motion, floral elements, activating energy",
  "气郁质": "bright open space, fresh floral, natural landscape, uplifting warm light",
  "特禀质": "pure white tones, clean hypoallergenic setting, natural pure ingredients",
  "平和质": "balanced natural warm tones, healthy lifestyle, harmonious atmosphere",
};

export interface ScriptParams {
  videoType: string;
  productName: string;
  constitutions: string[];
  solarTerm?: string;
  targetAudience?: string;
  purpose: string;
  customNotes?: string;
}

export function buildScriptPrompt(params: ScriptParams): string {
  const visualRef = params.constitutions
    .map(c => `${c}: ${CONSTITUTION_VISUAL[c] || "warm natural tones"}`)
    .join("\n");

  const typeConfig: Record<string, { duration: string; scenes: string }> = {
    kobo:      { duration: "60-90秒", scenes: "4-5个场景" },
    fangtan:   { duration: "90-180秒", scenes: "5-6个场景" },
    xianchang: { duration: "60-120秒", scenes: "5-7个场景" },
    qingjing:  { duration: "90-150秒", scenes: "6-8个场景" },
  };
  const tc = typeConfig[params.videoType] || typeConfig.kobo;

  return `你是灵芝水铺的短视频脚本策划师，专精中医养生内容创作。

【品牌定位】东方养生，中医体质管理，现代生活方式融合
【语言风格】专业且亲切，避免过度医疗化表达

【合规规则】严格禁用：治疗/治愈/根治/特效/速效/抗癌/防癌/增强免疫力
替换为：调理/改善/辅助调节/有助于/富含营养成分/有助于增强体质

【视频参数】
- 类型：${params.videoType}（${tc.duration}，${tc.scenes}）
- 产品：${params.productName}
- 目标体质：${params.constitutions.join("、") || "通用"}
- 关联节气：${params.solarTerm || "无"}
- 目标人群：${params.targetAudience || "通用养生人群"}
- 视频用途：${params.purpose}
- 补充说明：${params.customNotes || "无"}

【体质视觉参考（用于 imagePrompt）】
${visualRef}

严格按以下 JSON 格式输出，不包含任何其他文字或 markdown 代码块：

{
  "title": "视频标题（15字以内）",
  "totalDurationSeconds": 90,
  "scenes": [
    {
      "sceneNo": 1,
      "durationSeconds": 8,
      "shotType": "近景",
      "visualDesc": "中文画面描述，供运营人员确认，30字以内",
      "imagePrompt": "English prompt for image generation, cinematic, 16:9, TCM aesthetic, [use constitution visual style above], high quality, professional photography style",
      "voiceover": "旁白文案，口语化自然，不超过60字",
      "subtitle": "字幕文案，精炼，不超过20字",
      "musicMood": "平静",
      "avatarRole": "专家顾问"
    }
  ]
}

musicMood 可选值：平静 / 活力 / 温暖 / 神秘 / 专业
avatarRole 可选值：专家顾问 / 店员顾问 / 用户客户`;
}
