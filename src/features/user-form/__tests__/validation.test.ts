import { healthInputSchema, type HealthInput } from "@/features/user-form/types/schemas";

describe("HealthInput Validation", () => {
  const expectValid = (field: string, value: any) => {
    const result = healthInputSchema.pick({ [field]: true } as any).safeParse({ [field]: value });
    expect(result.success).toBe(true);
  };

  const expectInvalid = (field: string, value: any) => {
    const result = healthInputSchema.pick({ [field]: true } as any).safeParse({ [field]: value });
    expect(result.success).toBe(false);
  };

  describe("이름 필드 검증", () => {
    test("정상 케이스", () => expectValid("name", "김철수"));
    test("빈 문자열 거부", () => expectInvalid("name", ""));
    test("공백만 있는 문자열 거부", () => expectInvalid("name", "   "));
  });

  describe("건강 관련 고민사항 필드 검증", () => {
    test("정상 케이스", () => expectValid("concerns", ["obesity", "fatigue"]));
    test("빈 배열 거부", () => expectInvalid("concerns", []));
    test("최소 1개 이상 선택 필요", () => {
      const result = healthInputSchema.pick({ concerns: true } as any).safeParse({ concerns: ["obesity"] });
      expect(result.success).toBe(true);
    });
  });

  describe("운동 여부 필드 검증", () => {
    test("status만 있어도 통과", () => {
      const result = healthInputSchema.pick({ exercise: true }).safeParse({
        exercise: { status: false },
      });
      expect(result.success).toBe(true);
    });

    test("유효한 운동 정보 통과", () => {
      const result = healthInputSchema.pick({ exercise: true }).safeParse({
        exercise: {
          status: true,
          duration: "60",
          frequency: "3",
          intensity: "moderate",
        },
      });
      expect(result.success).toBe(true);
    });

    test("잘못된 intensity 거부", () => {
      const result = healthInputSchema.pick({ exercise: true }).safeParse({
        exercise: { status: true, intensity: "invalid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("수면 패턴 필드 검증", () => {
    test("정상 케이스", () => {
      const result = healthInputSchema.pick({ sleep: true }).safeParse({
        sleep: { hours: 7, quality: "good" },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("전체 폼 데이터 검증", () => {
    test("완전한 유효 데이터 통과", () => {
      const validData: HealthInput = {
        name: "김철수",
        birthYear: 1990,
        gender: "male",
        height: 175,
        weight: 70,
        concerns: ["obesity", "fatigue"],
        exercise: {
          status: true,
          duration: "60",
          frequency: "3",
          intensity: "moderate",
        },
        sleep: {
          hours: 7,
          quality: "good",
        },
      };

      const result = healthInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test("필수 필드 누락 시 거부", () => {
      const invalidData = {
        name: "김철수",
        // birthYear 누락
        gender: "male",
      };

      const result = healthInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test("복용 중인 약 필드는 선택사항", () => {
      const dataWithoutMeds = {
        name: "김철수",
        birthYear: 1990,
        gender: "male" as const,
        height: 175,
        weight: 70,
        concerns: ["fatigue"],
        exercise: { status: false },
        sleep: { hours: 7, quality: "good" as const },
      };

      const result = healthInputSchema.safeParse(dataWithoutMeds);
      expect(result.success).toBe(true);
    });
  });
});
