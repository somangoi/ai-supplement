import { z } from "zod";

// 영양제 추천 결과 스키마
export const supplementSchema = z.object({
  id: z.number(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  timing: z.string(),
  reason: z.string(),
});

export type Supplement = z.infer<typeof supplementSchema>;

// API 응답 스키마
export const supplementResponseSchema = z.object({
  recommendations: z.array(supplementSchema),
  disclaimer: z.string().optional(), // 주의사항 또는 법적 면책문구
  consultationRecommended: z.boolean().optional(), // 상담 권장 여부
});

export type SupplementResponse = z.infer<typeof supplementResponseSchema>;
