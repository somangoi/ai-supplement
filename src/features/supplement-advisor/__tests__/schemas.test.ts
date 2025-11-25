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
});
