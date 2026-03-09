"use client";

import { useVideoStore } from "@/store/videoStore";
import { StepBar } from "@/components/steps/StepBar";
import { Step1TypeSelect } from "@/components/steps/Step1TypeSelect";
import { Step2Params } from "@/components/steps/Step2Params";
import { Step3GenScript } from "@/components/steps/Step3GenScript";
import { Step4Scenes } from "@/components/steps/Step4Scenes";
import { Step5GenVideo } from "@/components/steps/Step5GenVideo";
import { Step6Review } from "@/components/steps/Step6Review";

export default function CreatePage() {
  const { currentStep, setStep } = useVideoStore();

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header with StepBar */}
      <div className="sticky top-0 z-30 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--border)] px-8 py-4">
        <StepBar current={currentStep} onStepClick={setStep} />
      </div>

      {/* Main content */}
      <div className="flex-1 px-8 py-6 max-w-5xl w-full mx-auto">
        {currentStep === 1 && <Step1TypeSelect />}
        {currentStep === 2 && <Step2Params />}
        {currentStep === 3 && <Step3GenScript />}
        {currentStep === 4 && <Step4Scenes />}
        {currentStep === 5 && <Step5GenVideo />}
        {currentStep === 6 && <Step6Review />}
      </div>
    </div>
  );
}
