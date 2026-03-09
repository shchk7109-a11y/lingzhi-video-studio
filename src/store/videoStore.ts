import { create } from "zustand";

export type VideoType = "kobo" | "fangtan" | "xianchang" | "qingjing" | null;

export interface SceneState {
  id?: string;
  sceneNo: number;
  duration: number;
  shotType: string;
  visualDesc: string;
  imagePrompt: string;
  voiceover: string;
  subtitle: string;
  musicMood: string;
  avatarRole: string;
  imageUrl?: string;
  imageStatus: "pending" | "generating" | "done" | "failed";
  videoClipUrl?: string;
  videoStatus: "pending" | "generating" | "done" | "failed";
}

interface VideoStore {
  currentStep: number;
  setStep: (n: number) => void;

  form: {
    videoType: VideoType;
    productName: string;
    constitutions: string[];
    solarTerm: string;
    targetAudience: string;
    purpose: string;
    customNotes: string;
  };
  setForm: (u: Partial<VideoStore["form"]>) => void;

  projectId: string | null;
  projectTitle: string;
  scenes: SceneState[];
  setProject: (id: string, title: string, scenes: SceneState[]) => void;
  updateScene: (sceneNo: number, u: Partial<SceneState>) => void;

  generating: boolean;
  genProgress: number;
  genStage: string;
  setGenerating: (v: boolean) => void;
  setGenProgress: (v: number) => void;
  setGenStage: (v: string) => void;

  reset: () => void;
}

const initForm = {
  videoType: null as VideoType,
  productName: "",
  constitutions: [] as string[],
  solarTerm: "",
  targetAudience: "",
  purpose: "培训",
  customNotes: "",
};

export const useVideoStore = create<VideoStore>((set) => ({
  currentStep: 1,
  setStep: (n) => set({ currentStep: n }),

  form: initForm,
  setForm: (u) => set((s) => ({ form: { ...s.form, ...u } })),

  projectId: null,
  projectTitle: "",
  scenes: [],
  setProject: (id, title, scenes) => set({ projectId: id, projectTitle: title, scenes }),
  updateScene: (sceneNo, u) =>
    set((s) => ({
      scenes: s.scenes.map((sc) => (sc.sceneNo === sceneNo ? { ...sc, ...u } : sc)),
    })),

  generating: false,
  genProgress: 0,
  genStage: "",
  setGenerating: (v) => set({ generating: v }),
  setGenProgress: (v) => set({ genProgress: v }),
  setGenStage: (v) => set({ genStage: v }),

  reset: () =>
    set({
      currentStep: 1,
      form: initForm,
      projectId: null,
      projectTitle: "",
      scenes: [],
      generating: false,
      genProgress: 0,
      genStage: "",
    }),
}));
