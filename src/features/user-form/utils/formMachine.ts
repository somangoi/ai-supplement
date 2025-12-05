import { Draft } from "immer";
import { HealthInput } from "../types/schemas";

// 1. 상태(State) 정의
export type FormStep = "intro" | "basicInfo" | "bodyInfo" | "medications" | "concerns" | "exercise" | "exerciseDetail" | "sleepPattern";

// 2. Step 메타데이터 정의
export interface StepConfig {
  order: number; // 진행 순서
  hasSubmit?: boolean; // 제출 단계 여부 체크
}

export const STEP_CONFIG: Record<FormStep, StepConfig> = {
  intro: { order: 0 },
  basicInfo: { order: 1 },
  bodyInfo: { order: 2 },
  medications: { order: 3 },
  concerns: { order: 4 },
  exercise: { order: 5 },
  exerciseDetail: { order: 6 },
  sleepPattern: { order: 7, hasSubmit: true },
};

// 진행률 계산 헬퍼
export const getStepProgress = (step: FormStep): number => {
  const config = STEP_CONFIG[step];
  if (!config) return 0;

  const maxOrder = Math.max(...Object.values(STEP_CONFIG).map((s) => s.order));
  return config.order === 0 ? 0 : (config.order / maxOrder) * 100;
};

// 3. 컨텍스트(Context) 데이터 정의
export type FormContext = Partial<HealthInput>;

export type FormState = {
  step: FormStep;
  context: FormContext;
};

export type FormEvent = { type: "NEXT"; data: Partial<HealthInput> } | { type: "PREV"; data?: Partial<HealthInput> };

// 4. 전이(Transition) 그래프 정의
type TransitionFn = (ctx: FormContext) => FormStep | null;
type Transition = FormStep | TransitionFn | null;

const TRANSITIONS: Record<FormStep, Transition> = {
  intro: "basicInfo",
  basicInfo: "bodyInfo",
  bodyInfo: "medications",
  medications: "concerns",
  concerns: "exercise",
  exercise: (ctx) => (ctx.exercise?.status === true ? "exerciseDetail" : "sleepPattern"),
  exerciseDetail: "sleepPattern",
  sleepPattern: null, // 종료 (컴포넌트에서 navigation 처리)
};

const REVERSE_TRANSITIONS: Record<FormStep, Transition> = {
  intro: null,
  basicInfo: "intro",
  bodyInfo: "basicInfo",
  medications: "bodyInfo",
  concerns: "medications",
  exercise: "concerns",
  exerciseDetail: "exercise",
  sleepPattern: (ctx) => (ctx.exercise?.status === true ? "exerciseDetail" : "exercise"),
};

function mergeContextData(draft: Draft<FormContext>, data: Partial<HealthInput>): void {
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof HealthInput];
    const existingValue = draft[key as keyof HealthInput];

    if (value && typeof value === "object" && !Array.isArray(value) && existingValue && typeof existingValue === "object" && !Array.isArray(existingValue)) {
      // 둘 다 객체인 경우 병합
      Object.assign(draft[key as keyof HealthInput] as any, value);
    } else {
      (draft as any)[key] = value;
    }
  });
}

// 5. Reducer - 전이 그래프를 따라감
export const formReducer = (draft: Draft<FormState>, event: FormEvent): void => {
  if (event.data) {
    mergeContextData(draft.context, event.data);
  }

  if (event.type === "NEXT") {
    const next = TRANSITIONS[draft.step];
    if (next) {
      const nextStep = typeof next === "function" ? next(draft.context) : next;
      if (nextStep) {
        draft.step = nextStep;
      }
    }
  } else if (event.type === "PREV") {
    const prev = REVERSE_TRANSITIONS[draft.step];
    if (prev) {
      const prevStep = typeof prev === "function" ? prev(draft.context) : prev;
      if (prevStep) {
        draft.step = prevStep;
      }
    }
  }
};
