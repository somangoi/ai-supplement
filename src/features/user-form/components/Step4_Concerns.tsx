import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { MultiSelector } from "@/shared/components/MultiSelector";
import { healthInputSchema, getConcernOptions } from "../types/schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const CONCERN_OPTIONS = getConcernOptions();

const Step4_Concerns = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{ concerns: string[] }>(props, {
    defaultValues: {
      concerns: initialData?.concerns || [],
    },
    resolver: zodResolver(healthInputSchema.pick({ concerns: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님은 어떤 고민이 있으신가요?`} subtitle="건강과 관련된 고민을 선택해주세요 (복수 선택 가능)" onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="concerns"
        render={({ field }) => (
          <MultiSelector label="건강 관련 고민" value={field.value} onChange={field.onChange} options={CONCERN_OPTIONS} error={errors.concerns?.message as string} minSelection={1} />
        )}
      />
    </UserFormLayout>
  );
};

export default Step4_Concerns;
