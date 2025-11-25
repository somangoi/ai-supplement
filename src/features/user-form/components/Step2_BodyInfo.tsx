import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/Input";
import { healthInputSchema } from "../types/schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const Step2_BodyInfo = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{ height: number; weight: number }>(props, {
    defaultValues: {
      height: initialData?.height,
      weight: initialData?.weight,
    },
    resolver: zodResolver(healthInputSchema.pick({ height: true, weight: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님의 몸무게와 키`} subtitle="정확한 추천을 위해 몸무게와 키를 알려주세요." onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="height"
        render={({ field }) => (
          <Input
            label="키"
            value={field.value ? field.value.toString() : ""}
            onChangeText={(text) => {
              const numValue = text === "" ? undefined : Number(text);
              field.onChange(isNaN(numValue as number) ? undefined : numValue);
            }}
            onBlur={field.onBlur}
            keyboardType="numeric"
            placeholder="키를 입력하세요 (cm)"
            error={errors.height?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="weight"
        render={({ field }) => (
          <Input
            label="몸무게"
            value={field.value ? field.value.toString() : ""}
            onChangeText={(text) => {
              const numValue = text === "" ? undefined : Number(text);
              field.onChange(isNaN(numValue as number) ? undefined : numValue);
            }}
            onBlur={field.onBlur}
            keyboardType="numeric"
            placeholder="몸무게를 입력하세요 (kg)"
            error={errors.weight?.message as string}
          />
        )}
      />
    </UserFormLayout>
  );
};

export default Step2_BodyInfo;
