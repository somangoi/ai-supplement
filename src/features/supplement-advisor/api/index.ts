import { HealthInput } from "@/features/user-form/types/schemas";
import { SupplementResponse } from "../types/schemas";
import { mockRecommendation } from "./mockData";
import { retryAsync } from "./retryLogic";
import { parseLLMResponse } from "./responseParser";
import { LLMResponseError } from "../types/errors";

// 테스트용 설정 - 아래 중 하나를 true로 설정하여 에러 UI 확인 가능
const TEST_ERROR_MODE = {
  parsing: false, // JSON 파싱 에러 시뮬레이션
  validation: false, // 스키마 검증 에러 시뮬레이션
  network: false, // 네트워크 에러 시뮬레이션
  api: false, // API 에러 시뮬레이션
};

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
 * OpenAI API 호출 (단일 시도)
 */
async function callOpenAI(userData: HealthInput, apiKey: string): Promise<SupplementResponse> {
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

  // API 에러 체크
  if (!response.ok) {
    console.error("❌ OpenAI API 에러:", data);
    throw new LLMResponseError(data.error?.message || `API 호출 실패 (status: ${response.status})`, "api");
  }

  // 응답 구조 확인
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("❌ 잘못된 응답 형식:", data);
    throw new LLMResponseError("OpenAI API 응답 형식이 올바르지 않습니다.", "api", JSON.stringify(data));
  }

  const content = data.choices[0].message.content;
  console.log("📄 OpenAI 응답:", content);

  // 응답 파싱 및 검증 (부분 응답 처리 포함)
  return parseLLMResponse(content);
}

/**
 * 영양제 추천 API 호출 (재시도 로직 포함)
 */
export const fetchSupplementRecommendations = async (userData: HealthInput): Promise<SupplementResponse> => {
  // 🧪 테스트 모드: 에러 시뮬레이션
  if (TEST_ERROR_MODE.parsing) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new LLMResponseError("JSON 파싱에 실패했습니다.", "parsing", '여기는 잘못된 JSON입니다... { "recommendations": [invalid] }');
  }
  if (TEST_ERROR_MODE.validation) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new LLMResponseError("응답 데이터의 형식이 올바르지 않습니다.", "validation", '{"recommendations": [], "disclaimer": "empty recommendations"}');
  }
  if (TEST_ERROR_MODE.network) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new LLMResponseError("네트워크 연결을 확인해주세요.", "network");
  }
  if (TEST_ERROR_MODE.api) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new LLMResponseError("OpenAI API 호출에 실패했습니다. (status: 429)", "api", '{"error": {"message": "Rate limit exceeded", "type": "insufficient_quota"}}');
  }

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  // 1. API Key가 없으면 Mock Data를 사용
  if (!apiKey) {
    console.log("⚠️ API Key가 없어 Mock Data를 사용합니다.");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return mockRecommendation;
  }

  // 2. API Key가 있으면 OpenAI API 호출 (재시도 포함)
  try {
    console.log("🔵 OpenAI API 호출 시작...", JSON.stringify(userData, null, 2));

    const result = await retryAsync(() => callOpenAI(userData, apiKey), { maxRetries: 2, delay: 1000, backoff: true });

    console.log("✅ OpenAI API 호출 성공!");
    return result;
  } catch (error) {
    console.error("💥 API 호출 중 에러:", error);

    // LLMResponseError인 경우 그대로 전파
    if (error instanceof LLMResponseError) {
      throw error;
    }

    // 네트워크 에러 처리
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new LLMResponseError("네트워크 연결을 확인해주세요.", "network");
    }

    // 기타 에러
    if (error instanceof Error) {
      throw new LLMResponseError(error.message, "api");
    }

    throw new LLMResponseError("알 수 없는 오류가 발생했습니다.", "api");
  }
};
