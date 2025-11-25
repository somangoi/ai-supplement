import { HealthInput } from "@/screens/UserFormScreen/schemas";
import { SupplementResponse, supplementResponseSchema } from "../types/schemas";
import { mockRecommendation } from "./mockData";

const SYSTEM_PROMPT = `
당신은 전문 영양 상담사입니다. 사용자의 건강 정보를 바탕으로 최적의 영양제 조합을 추천해주세요.
반드시 아래의 **JSON 형식**으로만 응답해야 합니다. 다른 말(인사말 등)은 절대 하지 마세요.

응답 형식 (JSON):
{
  "recommendations": [
    {
      "id": 1,
      "name": "영양제 이름",
      "dosage": "1일 섭취량 (예: 400IU)",
      "frequency": "1일 섭취 횟수 (예: 1회)",
      "timing": "섭취 시간 (예: 아침 식사 후)",
      "reason": "추천 이유 (한 줄 요약)"
    }
  ],
  "disclaimer": "추천 결과와 함께 보여줄 주의사항이나 법적 면책 문구"
}

주의사항:
- id는 1부터 시작하는 순차적인 번호입니다.
- recommendations 배열에는 3-5개의 영양제를 추천해주세요.
- reason은 사용자의 구체적인 상황을 반영하여 작성해주세요.
- disclaimer은 추천 결과와 함께 보여줄 주의사항이나 법적 면책 문구를 작성해주세요.
`;

/**
 * 영양제 추천 API 호출
 */
export const fetchSupplementRecommendations = async (userData: HealthInput): Promise<SupplementResponse> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  // 1. API Key가 없으면 Mock Data를 사용
  if (!apiKey) {
    console.log("⚠️ API Key가 없어 Mock Data를 사용합니다.");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return mockRecommendation;
  }

  // 2. API Key가 있으면 OpenAI API 호출
  try {
    console.log("🔵 OpenAI API 호출 시작...", JSON.stringify(userData, null, 2));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(userData, null, 2) },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();

    // 3. API 에러 체크
    if (!response.ok) {
      console.error("❌ OpenAI API 에러:", data);
      throw new Error(data.error?.message || `API 호출 실패 (status: ${response.status})`);
    }

    // 4. 응답 파싱
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("❌ 잘못된 응답 형식:", data);
      throw new Error("OpenAI API 응답 형식이 올바르지 않습니다.");
    }

    const content = data.choices[0].message.content;
    console.log("📄 OpenAI 응답:", content);

    const parsedData = JSON.parse(content);

    // 5. 스키마 검증
    const validated = supplementResponseSchema.safeParse(parsedData);

    if (!validated.success) {
      console.error("❌ 스키마 검증 실패:", validated.error);
      throw new Error(`응답 형식이 올바르지 않습니다: ${validated.error.message}`);
    }

    console.log("✅ OpenAI API 호출 성공!");
    return validated.data;
  } catch (error) {
    console.error("💥 API 호출 중 에러:", error);

    // 에러 타입에 따라 더 명확한 메시지 제공
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};
