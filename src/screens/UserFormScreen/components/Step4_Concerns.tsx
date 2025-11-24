import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/Input";
import { healthInputSchema } from "../schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const Step4_Concerns = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{ concerns: string }>(props, {
    defaultValues: {
      concerns: initialData?.concerns,
    },
    resolver: zodResolver(healthInputSchema.pick({ concerns: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님은 어떤 고민이 있으신가요?`} subtitle="건강과 관련된 걱정사항을 쉼표로 구분하여 입력해주세요." onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="concerns"
        render={({ field }) => (
          <Input
            label="건강 관련 걱정사항"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="예: 비만, 소화 불량, 혈압 상승"
            keyboardType="default"
            error={errors.concerns?.message as string}
          />
        )}
      />
    </UserFormLayout>
  );
};

export default Step4_Concerns;
