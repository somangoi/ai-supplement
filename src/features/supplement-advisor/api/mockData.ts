import { SupplementResponse } from "../types/schemas";

export const mockRecommendation = {
  recommendations: [
    {
      id: 1,
      name: "비타민 D",
      dosage: "2000 IU",
      frequency: "1일 1회",
      timing: "아침 식사 후",
      reason: "실내 활동이 많고 피로감을 느끼시므로 비타민 D 합성이 부족할 수 있습니다.",
    },
    {
      id: 2,
      name: "마그네슘",
      dosage: "400 mg",
      frequency: "1일 1회",
      timing: "저녁 식사 후",
      reason: "수면의 질이 낮고 스트레스가 있어 신경 이완과 숙면에 도움을 줍니다.",
    },
    {
      id: 3,
      name: "오메가-3",
      dosage: "1000 mg",
      frequency: "1일 1회",
      timing: "저녁 식사 후",
      reason: "불규칙한 식습관으로 인한 염증 관리 및 혈행 개선에 필요합니다.",
    },
    {
      id: 4,
      name: "비타민 C",
      dosage: "100 mg",
      frequency: "1일 1회",
      timing: "아침 식사 후",
      reason: "비타민 C 결핍 개선을 위해 권장됩니다.",
    },
    {
      id: 5,
      name: "비타민 B12",
      dosage: "1000 mcg",
      frequency: "1일 1회",
      timing: "저녁 식사 후",
      reason: "비타민 B12 결핍 개선을 위해 권장됩니다.",
    },
  ],
  disclaimer: "이 추천은 참고용이며, 전문의와 상담하시기 바랍니다.",
  consultationRecommended: true,
} as SupplementResponse;
