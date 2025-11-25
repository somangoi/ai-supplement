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
      "name": "영양제 이름 (예: 비타민D)",
      "dosage": "1일 섭취량 (예: 400IU)",
      "frequency": "1일 섭취 횟수 (예: 1회)",
      "timing": "섭취 시간 (예: 아침 식사 후)",
      "reason": "추천 이유 (사용자의 구체적인 정보를 반드시 포함)",
      "productName": "실제 구매 가능한 제품명 (예: 종근당 비타민D 1000IU 180정)",
      "purchaseUrl": "쿠팡 또는 네이버 쇼핑 구매 링크"
    }
  ],
  "disclaimer": "추천 결과와 함께 보여줄 주의사항이나 법적 면책 문구"
}

중요 지침:
1. recommendations 배열에는 3-5개의 영양제를 추천해주세요.

2. **사용자가 입력한 신체, 나이, 생활습관 등 모든 정보를 반드시 고려하세요** (매우 중요)

3. **제품 추천 및 구매 링크** (필수):
   - productName: 한국에서 실제로 구매 가능한 국내외 유명 브랜드 제품을 추천하세요.
     * 예: "종근당 비타민D 1000IU", "뉴트리코어 RTG 오메가3", "센트룸 포 우먼", "GNM자연의품격 비타민B 컴플렉스" 등
     * 제품명에 용량과 수량을 포함하세요 (예: "180정", "60캡슐")
   - purchaseUrl: 쿠팡 또는 네이버 쇼핑 링크 또는 아이허브 쇼핑 링크를 제공하세요.
     * 쿠팡 링크 형식: https://www.coupang.com/vp/products/[제품ID]
     * 네이버 쇼핑 검색 링크: https://search.shopping.naver.com/search/all?query=[제품명]
     * 실제 존재하는 제품을 추천하되, 정확한 URL을 모른다면 네이버 쇼핑 검색 링크를 사용하세요.

3. **reason 작성 규칙** (매우 중요):
   - **2-3개 문장**으로 작성하세요 (120자 이상).
   - 사용자의 구체적인 수치(운동량, 수면시간, BMI 등)를 자연스럽게 녹여서 작성하세요.
   - **반드시 "~요" 체를 사용**하세요. ("~습니다", "~입니다" 금지)
   - 구조: [상황 + 문제점] → [영양제 효과] → [추가 혜택]

   ✅ 예시 (좋은 reason - ~요 체 사용):
   - "주 3회 중간 강도 운동에도 불구하고 피로감을 느끼고 계시는데, 비타민 B군은 운동 후 회복과 에너지 대사를 촉진해요. 하루 5시간의 짧은 수면으로 인한 피로 누적 완화에도 효과적이에요."
   - "BMI 27.6으로 체중 관리가 필요하고 현재 규칙적인 운동을 하지 않는 상황에서, 오메가-3는 지방 대사를 촉진하고 혈중 콜레스테롤 개선에 도움이 돼요. 심혈관 건강도 함께 챙길 수 있어요."
   - "하루 5시간의 부족한 수면과 낮은 수면의 질, 그리고 스트레스 문제를 겪고 계세요. 마그네슘은 신경 안정과 근육 이완을 도와 수면의 질 개선에 효과적이에요."
   - "스트레스와 탈모로 고민 중이신데, 아연은 모발 성장과 두피 건강에 중요한 역할을 해요. 스트레스로 인한 면역력 저하 개선에도 도움이 돼요."

   ❌ 예시 (나쁜 reason):
   - "33세 여성으로 하루 8시간 수면을 취하고 있으나 스트레스와 탈모로 고민 중입니다." (형식적, 거리감, ~습니다 체)
   - "비타민D는 뼈 건강에 좋습니다." (일반적, ~습니다 체)
   - "피로 회복에 도움됩니다." (구체적 수치 없음, ~습니다 체)
   - "30대 남성입니다. 운동을 합니다." (단절된 문장, ~습니다 체)

4. disclaimer는 현재 복용 중인 약물이 있다면 반드시 언급하고, 전문의 상담을 권장하세요. **~요 체를 사용**하세요.

5. id는 1부터 시작하는 순차적인 번호입니다.
`;

/**
 * 사용자 데이터를 더 읽기 쉬운 형태로 포맷팅
 */
function formatUserDataForPrompt(userData: HealthInput): string {
  const age = new Date().getFullYear() - userData.birthYear;
  const genderLabel = userData.gender === "male" ? "남성" : userData.gender === "female" ? "여성" : "기타";

  // 나이대 구분
  let ageGroup = "";
  if (age < 30) ageGroup = "20대";
  else if (age < 40) ageGroup = "30대";
  else if (age < 50) ageGroup = "40대";
  else if (age < 60) ageGroup = "50대";
  else ageGroup = "60대 이상";

  // BMI 계산 및 해석
  const bmi = userData.weight / Math.pow(userData.height / 100, 2);
  let bmiCategory = "";
  if (bmi < 18.5) bmiCategory = "저체중";
  else if (bmi < 23) bmiCategory = "정상";
  else if (bmi < 25) bmiCategory = "과체중";
  else if (bmi < 30) bmiCategory = "경도비만";
  else bmiCategory = "중등도비만 이상";

  const concernLabels: Record<string, string> = {
    obesity: "비만",
    digestion: "소화불량",
    blood_pressure: "혈압",
    fatigue: "피로감",
    stress: "스트레스",
    immunity: "면역력",
    joint_pain: "관절통증",
    skin: "피부트러블",
    hair_loss: "탈모",
    insomnia: "불면증",
    anemia: "빈혈",
    bone_health: "뼈건강",
    eye_health: "눈건강",
    memory: "기억력",
    cholesterol: "콜레스테롤",
  };

  const concerns = userData.concerns.map((c) => concernLabels[c] || c).join(", ");

  let exerciseInfo = "운동을 하지 않음 (활동량 부족)";
  if (userData.exercise.status && userData.exercise.intensity) {
    const intensityLabel =
      userData.exercise.intensity === "light" ? "가벼운 강도 (산책, 요가 등)" : userData.exercise.intensity === "moderate" ? "중간 강도 (조깅, 수영 등)" : "높은 강도 (헬스, 달리기 등)";
    exerciseInfo = `${intensityLabel}로 ${userData.exercise.frequency || "규칙적으로"} 운동, ${userData.exercise.duration || "시간 미상"}`;
  }

  const sleepQualityLabel = userData.sleep.quality === "good" ? "좋음 (숙면)" : userData.sleep.quality === "average" ? "보통 (보통)" : "안좋음 (불면, 자주 깸)";

  // 수면 시간 평가
  let sleepEvaluation = "";
  if (userData.sleep.hours < 6) sleepEvaluation = "(매우 부족)";
  else if (userData.sleep.hours < 7) sleepEvaluation = "(부족)";
  else if (userData.sleep.hours <= 8) sleepEvaluation = "(적정)";
  else sleepEvaluation = "(과다)";

  return `
## 사용자 건강 정보

**기본 정보:**
- 이름: ${userData.name}
- 나이: ${age}세 (${ageGroup}, ${userData.birthYear}년생)
- 성별: ${genderLabel}

**신체 정보:**
- 키: ${userData.height}cm
- 몸무게: ${userData.weight}kg
- BMI: ${bmi.toFixed(1)} (${bmiCategory})

**복용 중인 약물:**
${userData.medications || "없음"}

**건강 고민:**
${concerns}

**운동 습관:**
${exerciseInfo}

**수면 패턴:**
- 수면 시간: 하루 ${userData.sleep.hours}시간 ${sleepEvaluation}
- 수면 질: ${sleepQualityLabel}

---

위 정보를 바탕으로, 각 영양제 추천 시 사용자의 구체적인 수치와 상황(나이대, BMI 상태, 운동 강도, 수면 시간 등)을 반드시 언급하여 설득력 있는 추천 이유를 작성해주세요.
`;
}

/**
 * OpenAI API 호출 (단일 시도)
 */
async function callOpenAI(userData: HealthInput, apiKey: string): Promise<SupplementResponse> {
  const formattedPrompt = formatUserDataForPrompt(userData);

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
        { role: "user", content: formattedPrompt },
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
