import { guhighClient, getModelConfig } from "./guhighClient";
import { buildScriptPrompt, ScriptParams } from "@/lib/prompts/scriptPrompt";

export async function generateScript(params: ScriptParams) {
  const scriptModel = await getModelConfig(
    "script_model",
    process.env.SCRIPT_MODEL_DEFAULT || "gemini-3.1-flash"
  );

  const prompt = buildScriptPrompt(params);

  const completion = await guhighClient.chat.completions.create({
    model: scriptModel,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content || "{}";
  return { scriptData: JSON.parse(raw), scriptModel };
}
