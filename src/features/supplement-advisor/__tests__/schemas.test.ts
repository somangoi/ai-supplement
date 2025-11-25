import { supplementResponseSchema } from "@/features/supplement-advisor/types/schemas";

describe("SupplementResponse parsing", () => {
  test("정상적인 LLM 응답을 구조화할 수 있다", () => {
    const mock = {
      recommendations: [
        {
          id: 1,
          name: "Vitamin D",
          dosage: "400 IU",
          frequency: "daily",
          timing: "morning",
          reason: "흡수 촉진 및 골격 건강",
        },
      ],
      disclaimer: "의료 전문 상담이 필요할 수 있음",
      consultationRecommended: true,
    };

    const result = supplementResponseSchema.safeParse(mock);
    expect(result.success).toBe(true);
  });

  test("잘못된 응답은 파싱에 실패해야 한다", () => {
    const invalidMock = {
      recommendations: [
        {
          name: "Magnesium",
          // dosage 누락
        },
      ],
    };

    const result = supplementResponseSchema.safeParse(invalidMock);
    expect(result.success).toBe(false);
  });

  test("제품명과 구매 링크를 포함한 응답을 구조화할 수 있다", () => {
    const mockWithProduct = {
      recommendations: [
        {
          id: 1,
          name: "Vitamin D",
          dosage: "2000 IU",
          frequency: "1일 1회",
          timing: "아침 식사 후",
          reason: "실내 활동이 많아 비타민 D 합성이 부족할 수 있어요.",
          productName: "종근당 비타민D 2000IU 180정",
          purchaseUrl: "https://search.shopping.naver.com/search/all?query=종근당+비타민D",
        },
      ],
      disclaimer: "의료 전문 상담이 필요할 수 있음",
    };

    const result = supplementResponseSchema.safeParse(mockWithProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recommendations[0].productName).toBe("종근당 비타민D 2000IU 180정");
      expect(result.data.recommendations[0].purchaseUrl).toContain("https://");
    }
  });

  test("제품 정보 없이도 파싱에 성공해야 한다 (optional)", () => {
    const mockWithoutProduct = {
      recommendations: [
        {
          id: 1,
          name: "Vitamin D",
          dosage: "400 IU",
          frequency: "daily",
          timing: "morning",
          reason: "흡수 촉진 및 골격 건강",
          // productName, purchaseUrl 없음
        },
      ],
    };

    const result = supplementResponseSchema.safeParse(mockWithoutProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recommendations[0].productName).toBeUndefined();
      expect(result.data.recommendations[0].purchaseUrl).toBeUndefined();
    }
  });

  test("제품명만 있고 구매 링크가 없어도 파싱에 성공해야 한다", () => {
    const mockPartialProduct = {
      recommendations: [
        {
          id: 1,
          name: "Omega-3",
          dosage: "1000 mg",
          frequency: "1일 1회",
          timing: "저녁 식사 후",
          reason: "혈행 개선에 도움이 돼요.",
          productName: "뉴트리코어 RTG 오메가3",
          // purchaseUrl 없음
        },
      ],
    };

    const result = supplementResponseSchema.safeParse(mockPartialProduct);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recommendations[0].productName).toBe("뉴트리코어 RTG 오메가3");
      expect(result.data.recommendations[0].purchaseUrl).toBeUndefined();
    }
  });
});
