/**
 * 재시도 로직 유틸리티
 */

interface RetryOptions {
  maxRetries: number;
  delay: number;
  backoff?: boolean; // 지수 백오프 사용 여부
}

/**
 * 지정된 횟수만큼 비동기 함수를 재시도합니다
 */
export async function retryAsync<T>(fn: () => Promise<T>, options: RetryOptions = { maxRetries: 3, delay: 1000, backoff: true }): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < options.maxRetries) {
        // 재시도 전 대기
        const waitTime = options.backoff
          ? options.delay * Math.pow(2, attempt) // 지수 백오프
          : options.delay;

        console.log(`⏳ 재시도 ${attempt + 1}/${options.maxRetries} (${waitTime}ms 후)...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
