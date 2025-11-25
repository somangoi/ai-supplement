import { SupplementResponse } from "../types/schemas";

export const mockRecommendation = {
  recommendations: [
    {
      id: 1,
      name: "비타민 D",
      dosage: "2000 IU",
      frequency: "1일 1회",
      timing: "아침 식사 후",
      reason: "실내 활동이 많고 피로감을 느끼고 계셔서 비타민 D 합성이 부족할 수 있어요. 비타민 D는 면역력 강화와 뼈 건강 유지에 필수적이며, 특히 햇빛 노출이 적은 직장인에게 중요해요.",
      productName: "종근당 비타민D 2000IU 180정",
      purchaseUrl: "https://search.shopping.naver.com/search/all?query=종근당+비타민D+2000IU",
    },
    {
      id: 2,
      name: "마그네슘",
      dosage: "400 mg",
      frequency: "1일 1회",
      timing: "저녁 식사 후",
      reason: "하루 6시간 미만의 짧은 수면과 낮은 수면의 질, 그리고 스트레스 문제를 겪고 계세요. 마그네슘은 신경 안정과 근육 이완을 도와 수면의 질을 개선하는 데 효과적이에요.",
      productName: "GNM자연의품격 킬레이트 마그네슘 400mg 180정",
      purchaseUrl: "https://search.shopping.naver.com/search/all?query=GNM+마그네슘+400mg",
    },
    {
      id: 3,
      name: "오메가-3",
      dosage: "1000 mg",
      frequency: "1일 1회",
      timing: "저녁 식사 후",
      reason: "규칙적인 운동을 하지 않고 있고 혈압이나 콜레스테롤 관리가 필요한 상황에서, 오메가-3는 혈행 개선과 심혈관 건강에 도움이 돼요. 염증 완화 효과도 기대할 수 있어요.",
      productName: "뉴트리코어 RTG 오메가3 1000mg 90캡슐",
      purchaseUrl: "https://search.shopping.naver.com/search/all?query=뉴트리코어+RTG+오메가3",
    },
    {
      id: 4,
      name: "비타민 B 콤플렉스",
      dosage: "1정",
      frequency: "1일 1회",
      timing: "아침 식사 후",
      reason: "피로감과 스트레스를 느끼고 계시는데, 비타민 B군은 에너지 대사를 촉진하고 신경계 건강을 지원해요. 만성 피로 개선과 집중력 향상에도 효과적이에요.",
      productName: "GNM자연의품격 비타민B 컴플렉스 60정",
      purchaseUrl: "https://search.shopping.naver.com/search/all?query=GNM+비타민B+컴플렉스",
    },
  ],
  disclaimer: "이 추천은 일반적인 건강 정보 제공 목적이며, 개인의 건강 상태에 따라 적합하지 않을 수 있어요. 현재 복용 중인 약물이 있거나 건강 문제가 있는 경우 반드시 전문의와 상담하시기 바라요.",
  consultationRecommended: true,
} as SupplementResponse;
