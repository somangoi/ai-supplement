/**
 * LLM 응답 처리 관련 에러 타입
 */

export class LLMResponseError extends Error {
  public readonly rawResponse?: string;
  public readonly retryCount: number;
  public readonly errorType: "parsing" | "validation" | "api" | "network";

  constructor(message: string, errorType: "parsing" | "validation" | "api" | "network", rawResponse?: string, retryCount: number = 0) {
    super(message);
    this.name = "LLMResponseError";
    this.errorType = errorType;
    this.rawResponse = rawResponse;
    this.retryCount = retryCount;
  }
}
