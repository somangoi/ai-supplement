import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Selector } from "@/components/Selector";
import { healthInputSchema, getExerciseStatusOptions } from "../schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const EXERCISE_STATUS_OPTIONS = getExerciseStatusOptions();

const Step5_Exercise = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{ exercise: { status: boolean } }>(props, {
    defaultValues: {
      exercise: {
        status: initialData?.exercise?.status,
      },
    },
    resolver: zodResolver(healthInputSchema.pick({ exercise: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님은 운동을 하시나요?`} subtitle="운동 여부를 답변해주세요." onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="exercise.status"
        render={({ field }) => (
          <Selector label="운동 여부" value={field.value} onChange={field.onChange} options={EXERCISE_STATUS_OPTIONS} error={(errors.exercise as any)?.status?.message as string} />
        )}
      />
    </UserFormLayout>
  );
};

export default Step5_Exercise;
