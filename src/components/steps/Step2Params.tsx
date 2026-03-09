"use client";

import { useVideoStore } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { FormGroup } from "@/components/ui/FormGroup";
import { Tag } from "@/components/ui/Tag";

const CONSTITUTIONS = [
  "气虚质", "阳虚质", "阴虚质", "痰湿质",
  "湿热质", "血瘀质", "气郁质", "特禀质", "平和质",
];

const SOLAR_TERMS = [
  "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
  "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
  "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
  "立冬", "小雪", "大雪", "冬至", "小寒", "大寒",
];

const PURPOSE_OPTIONS = ["培训", "宣传", "销售", "科普", "品牌"];

export function Step2Params() {
  const { form, setForm, setStep } = useVideoStore();

  function toggleConstitution(c: string) {
    const current = form.constitutions;
    if (current.includes(c)) {
      setForm({ constitutions: current.filter(x => x !== c) });
    } else {
      setForm({ constitutions: [...current, c] });
    }
  }

  function handleNext() {
    if (form.productName.trim()) setStep(3);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          填写视频参数
        </h2>
        <p className="text-sm text-[var(--text-muted)]">这些参数将直接影响脚本内容与画面风格</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 产品名称 */}
        <FormGroup label="产品名称" required className="md:col-span-2">
          <input
            type="text"
            value={form.productName}
            onChange={(e) => setForm({ productName: e.target.value })}
            placeholder="例：灵芝孢子粉固体饮料"
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </FormGroup>

        {/* 目标体质 */}
        <FormGroup label="目标体质" hint="可多选，留空表示通用" className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {CONSTITUTIONS.map(c => (
              <Tag
                key={c}
                label={c}
                active={form.constitutions.includes(c)}
                onClick={() => toggleConstitution(c)}
              />
            ))}
          </div>
        </FormGroup>

        {/* 关联节气 */}
        <FormGroup label="关联节气" hint="可选，用于节气主题内容">
          <select
            value={form.solarTerm}
            onChange={(e) => setForm({ solarTerm: e.target.value })}
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors"
          >
            <option value="">不关联节气</option>
            {SOLAR_TERMS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FormGroup>

        {/* 视频用途 */}
        <FormGroup label="视频用途">
          <div className="flex flex-wrap gap-2">
            {PURPOSE_OPTIONS.map(p => (
              <Tag
                key={p}
                label={p}
                active={form.purpose === p}
                onClick={() => setForm({ purpose: p })}
              />
            ))}
          </div>
        </FormGroup>

        {/* 目标人群 */}
        <FormGroup label="目标人群" hint="可选，留空使用默认描述">
          <input
            type="text"
            value={form.targetAudience}
            onChange={(e) => setForm({ targetAudience: e.target.value })}
            placeholder="例：35-50岁女性，注重健康养生"
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </FormGroup>

        {/* 补充说明 */}
        <FormGroup label="补充说明" hint="可选，如节日氛围、特殊要求等" className="md:col-span-2">
          <textarea
            rows={3}
            value={form.customNotes}
            onChange={(e) => setForm({ customNotes: e.target.value })}
            placeholder="例：本周双十一活动，需突出促销氛围，片尾加优惠提示"
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
          />
        </FormGroup>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep(1)}>返回</Button>
        <Button onClick={handleNext} disabled={!form.productName.trim()} size="lg">
          下一步：生成脚本
        </Button>
      </div>
    </div>
  );
}
