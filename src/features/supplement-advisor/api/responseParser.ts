import { z } from "zod";
import { SupplementResponse, supplementResponseSchema, Supplement } from "../types/schemas";
import { LLMResponseError } from "../types/errors";

/**
 * JSON 파싱을 시도하고, 실패 시 텍스트에서 JSON 추출 시도
 */
export function parseJSON(content: string): any {
  try {
    // 1. 일반적인 JSON 파싱 시도
    return JSON.parse(content);
  } catch (error) {
    console.log("⚠️ JSON 파싱 실패, 텍스트에서 JSON 추출 시도...");

    // 2. 마크다운 코드 블록에 감싸진 JSON 추출
    const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch (e) {
        // 계속 진행
      }
    }

    // 3. 텍스트에서 첫 번째 JSON 객체 추출
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        // 계속 진행
      }
    }

    throw new LLMResponseError("JSON 파싱에 실패했습니다.", "parsing", content);
  }
}

/**
 * 부분적으로라도 유효한 데이터를 추출하여 반환
 */
export function parsePartialResponse(rawData: any, rawContent: string): SupplementResponse {
  console.log("🔄 부분 응답 처리 시도...");

  // 최소한의 구조라도 있는지 확인
  if (!rawData || typeof rawData !== "object") {
    throw new LLMResponseError("응답 형식이 올바르지 않습니다.", "validation", rawContent);
  }

  // recommendations 배열 처리
  let validRecommendations: Supplement[] = [];

  if (Array.isArray(rawData.recommendations)) {
    validRecommendations = rawData.recommendations
      .map((item: unknown, index: number): Supplement | null => {
        try {
          // 부분적인 필드라도 복구 시도
          const rec = item as Record<string, any>;
          return {
            id: rec.id ?? index + 1,
            name: rec.name ?? "영양제",
            dosage: rec.dosage ?? "권장량",
            frequency: rec.frequency ?? "1일 1회",
            timing: rec.timing ?? "식사 후",
            reason: rec.reason ?? "건강 개선에 도움",
            // optional 필드
            ...(rec.productName && { productName: rec.productName }),
            ...(rec.purchaseUrl && { purchaseUrl: rec.purchaseUrl }),
          };
        } catch (e) {
          return null;
        }
      })
      .filter((item: Supplement | null): item is Supplement => item !== null);
  }

  // 최소 1개 이상의 추천이 있어야 함
  if (validRecommendations.length === 0) {
    throw new LLMResponseError("유효한 영양제 추천을 찾을 수 없습니다.", "validation", rawContent);
  }

  console.log(`✅ ${validRecommendations.length}개의 추천 복구 성공`);

  return {
    recommendations: validRecommendations,
    disclaimer: typeof rawData.disclaimer === "string" ? rawData.disclaimer : "이 추천은 참고용이며, 전문의와 상담하시기 바랍니다.",
    consultationRecommended: rawData.consultationRecommended ?? true,
  };
}

/**
 * LLM 응답을 파싱하고 검증합니다
 */
export function parseLLMResponse(content: string): SupplementResponse {
  // 1. JSON 파싱
  let parsedData: any;
  try {
    parsedData = parseJSON(content);
  } catch (error) {
    if (error instanceof LLMResponseError) {
      throw error;
    }
    throw new LLMResponseError("응답을 파싱할 수 없습니다.", "parsing", content);
  }

  // 2. 엄격한 스키마 검증 시도
  const strictValidation = supplementResponseSchema.safeParse(parsedData);
  if (strictValidation.success) {
    console.log("✅ 스키마 검증 성공");
    return strictValidation.data;
  }

  console.warn("⚠️ 엄격한 검증 실패:", strictValidation.error);

  // 3. 부분 응답 파싱 시도
  try {
    return parsePartialResponse(parsedData, content);
  } catch (error) {
    if (error instanceof LLMResponseError) {
      throw error;
    }
    throw new LLMResponseError("응답 검증에 실패했습니다.", "validation", content);
  }
}
