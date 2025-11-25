import { z } from "zod";
import { SelectorOption } from "@/shared/components/Selector";

// Enum 타입 정의
export const GenderEnum = z.enum(["male", "female", "other"]);
export const ExerciseIntensityEnum = z.enum(["light", "moderate", "heavy"]);
export const SleepQualityEnum = z.enum(["good", "average", "bad"]);

// 타입 추출
export type Gender = z.infer<typeof GenderEnum>;
export type ExerciseIntensity = z.infer<typeof ExerciseIntensityEnum>;
export type SleepQuality = z.infer<typeof SleepQualityEnum>;

// 입력 폼 스키마
export const healthInputSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .refine((val: string) => val && val.trim().length > 0, { message: "이름을 입력해주세요" }),
  birthYear: z.number().min(1900, "올바른 출생년도를 선택해주세요").max(new Date().getFullYear(), "올바른 출생년도를 선택해주세요"),
  gender: GenderEnum,
  height: z.number({ message: "키를 입력해주세요" }).min(50).max(250), // cm
  weight: z.number({ message: "몸무게를 입력해주세요" }).min(20).max(300), // kg
  medications: z.string({ message: "복용 중인 약을 입력해주세요" }).optional(),
  concerns: z.array(z.string()).min(1, "적어도 한 가지 이상의 고민을 선택해주세요"),
  exercise: z.object({
    status: z.boolean(),
    duration: z.string().optional(),
    frequency: z.string().optional(),
    intensity: ExerciseIntensityEnum.optional(),
  }),
  sleep: z.object({
    hours: z.number({ message: "수면 시간을 입력해주세요" }).min(0).max(24),
    quality: SleepQualityEnum,
  }),
});

export type HealthInput = z.infer<typeof healthInputSchema>;

export const getGenderOptions = (): SelectorOption<Gender>[] => [
  { value: "male", label: "남자", icon: "👨" },
  { value: "female", label: "여자", icon: "👩" },
  { value: "other", label: "기타", icon: "🧑" },
];

export const getExerciseStatusOptions = (): SelectorOption<boolean>[] => [
  { value: false, label: "안해요", icon: "❌" },
  { value: true, label: "해요", icon: "🙆‍♂️" },
];

export const getExerciseIntensityOptions = (): SelectorOption<ExerciseIntensity>[] => [
  { value: "light", label: "가벼운", icon: "🚶‍♂️" },
  { value: "moderate", label: "중간", icon: "🏃‍♂️" },
  { value: "heavy", label: "강도 높은", icon: "🏋" },
];

export const getSleepQualityOptions = (): SelectorOption<SleepQuality>[] => [
  { value: "bad", label: "안좋음", icon: "😫" },
  { value: "average", label: "보통", icon: "😐" },
  { value: "good", label: "좋음", icon: "🥰" },
];

export const getConcernOptions = () => [
  { value: "obesity", label: "비만", icon: "⚖️" },
  { value: "digestion", label: "소화불량", icon: "🤢" },
  { value: "blood_pressure", label: "혈압", icon: "💓" },
  { value: "fatigue", label: "피로감", icon: "😴" },
  { value: "stress", label: "스트레스", icon: "😰" },
  { value: "immunity", label: "면역력", icon: "🛡️" },
  { value: "joint_pain", label: "관절통증", icon: "🦴" },
  { value: "skin", label: "피부트러블", icon: "🧴" },
  { value: "hair_loss", label: "탈모", icon: "👨‍🦲" },
  { value: "insomnia", label: "불면증", icon: "🌙" },
  { value: "anemia", label: "빈혈", icon: "🩸" },
  { value: "bone_health", label: "뼈건강", icon: "🦴" },
  { value: "eye_health", label: "눈건강", icon: "👁️" },
  { value: "memory", label: "기억력", icon: "🧠" },
  { value: "cholesterol", label: "콜레스테롤", icon: "🫀" },
];
