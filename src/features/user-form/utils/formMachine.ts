import { Draft } from "immer";
import { HealthInput } from "../types/schemas";

// 1. 상태(State) 정의
export type FormStep = "intro" | "basicInfo" | "bodyInfo" | "medications" | "concerns" | "exercise" | "exerciseDetail" | "sleepPattern";

// 2. 컨텍스트(Context) 데이터 정의
export type FormContext = Partial<HealthInput>;

export type FormState = {
  step: FormStep;
  context: FormContext;
};

export type FormEvent = { type: "NEXT"; data: Partial<HealthInput> } | { type: "PREV"; data?: Partial<HealthInput> };

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

export const formReducer = (draft: Draft<FormState>, event: FormEvent): void => {
  if (event.data) {
    mergeContextData(draft.context, event.data);
  }
  switch (draft.step) {
    case "intro":
      if (event.type === "NEXT") draft.step = "basicInfo";
      break;

    case "basicInfo":
      if (event.type === "NEXT") draft.step = "bodyInfo";
      if (event.type === "PREV") draft.step = "intro";
      break;

    case "bodyInfo":
      if (event.type === "NEXT") draft.step = "medications";
      if (event.type === "PREV") draft.step = "basicInfo";
      break;

    case "medications":
      if (event.type === "NEXT") draft.step = "concerns";
      if (event.type === "PREV") draft.step = "bodyInfo";
      break;

    case "concerns":
      if (event.type === "NEXT") draft.step = "exercise";
      if (event.type === "PREV") draft.step = "medications";
      break;

    case "exercise":
      if (event.type === "NEXT") {
        // exercise 값에 따라 조건부 분기
        const exerciseValue = event.data.exercise;
        const isExercising = exerciseValue?.status === true;
        draft.step = isExercising ? "exerciseDetail" : "sleepPattern";
      }
      if (event.type === "PREV") draft.step = "concerns";
      break;

    case "exerciseDetail":
      if (event.type === "NEXT") draft.step = "sleepPattern";
      if (event.type === "PREV") draft.step = "exercise";
      break;

    case "sleepPattern":
      // NEXT는 처리하지 않음 - 대신 컴포넌트에서 직접 navigation
      if (event.type === "PREV") {
        // 이전 단계가 exerciseDetail일 수도 있고 exercise일 수도 있음
        // exercise 값을 확인하여 이전 단계 결정
        const exerciseValue = draft.context.exercise;
        const isExercising = exerciseValue?.status === true;
        draft.step = isExercising ? "exerciseDetail" : "exercise";
      }
      break;
  }
};
