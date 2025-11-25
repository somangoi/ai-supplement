import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Picker } from "@/shared/components/Picker";
import { healthInputSchema } from "../types/schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

// 키 옵션 생성 (140cm ~ 210cm)
const HEIGHT_OPTIONS = Array.from({ length: 71 }, (_, i) => {
  const height = 140 + i;
  return { label: `${height}cm`, value: height };
});

// 몸무게 옵션 생성 (30kg ~ 150kg)
const WEIGHT_OPTIONS = Array.from({ length: 121 }, (_, i) => {
  const weight = 30 + i;
  return { label: `${weight}kg`, value: weight };
});

// 중간값 계산
const DEFAULT_HEIGHT = 170; // 키 170cm
const DEFAULT_WEIGHT = 65; // 몸무게 65kg

const Step2_BodyInfo = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{ height: number; weight: number }>(props, {
    defaultValues: {
      height: initialData?.height ?? DEFAULT_HEIGHT,
      weight: initialData?.weight ?? DEFAULT_WEIGHT,
    },
    resolver: zodResolver(healthInputSchema.pick({ height: true, weight: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님의 몸무게와 키`} subtitle="정확한 추천을 위해 몸무게와 키를 알려주세요." onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="height"
        render={({ field }) => (
          <Picker
            label="키"
            value={field.value}
            onChange={(val) => field.onChange(typeof val === "string" ? Number(val) : val)}
            options={HEIGHT_OPTIONS}
            placeholder="키를 선택해주세요"
            error={errors.height?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="weight"
        render={({ field }) => (
          <Picker
            label="몸무게"
            value={field.value}
            onChange={(val) => field.onChange(typeof val === "string" ? Number(val) : val)}
            options={WEIGHT_OPTIONS}
            placeholder="몸무게를 선택해주세요"
            error={errors.weight?.message as string}
          />
        )}
      />
    </UserFormLayout>
  );
};

export default Step2_BodyInfo;
