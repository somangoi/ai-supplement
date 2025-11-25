import { useQuery } from "@tanstack/react-query";
import { fetchSupplementRecommendations } from ".";
import { HealthInput } from "@/features/user-form/types/schemas";
import { SupplementResponse } from "../types/schemas";
import { LLMResponseError } from "../types/errors";

interface UseSupplementAdvisorOptions {
  formData: HealthInput;
  enabled?: boolean;
}

export function useSupplementAdvisor({ formData, enabled = false }: UseSupplementAdvisorOptions) {
  return useQuery<SupplementResponse, LLMResponseError>({
    queryKey: ["supplement-advisor", formData],
    queryFn: () => fetchSupplementRecommendations(formData),

    enabled, // true일 때만 실행됨
    retry: false, // 재시도는 API 레벨에서 처리함
    staleTime: 1000 * 60 * 10, // 10분 동안 fresh
    gcTime: 1000 * 60 * 30, // 30분 후 캐시에서 제거
  });
}
