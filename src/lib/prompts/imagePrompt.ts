import { CONSTITUTION_VISUAL } from "./scriptPrompt";

export function enhanceImagePrompt(
  basePrompt: string,
  constitutions: string[]
): string {
  const visualStyles = constitutions
    .map(c => CONSTITUTION_VISUAL[c])
    .filter(Boolean)
    .join(", ");

  if (!visualStyles) return basePrompt;

  return `${basePrompt}, ${visualStyles}`;
}
