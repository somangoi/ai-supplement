import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Picker } from "@/shared/components/Picker";
import { Selector } from "@/shared/components/Selector";
import { healthInputSchema, getExerciseIntensityOptions, type ExerciseIntensity } from "../types/schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const EXERCISE_INTENSITY_OPTIONS = getExerciseIntensityOptions();

const Step5_1_ExerciseDetail = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{
    exercise: {
      status: boolean;
      duration?: string;
      frequency?: string;
      intensity?: "light" | "moderate" | "heavy";
    };
  }>(props, {
    defaultValues: {
      exercise: initialData?.exercise,
    },
    resolver: zodResolver(healthInputSchema.pick({ exercise: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님은 운동을 어떻게 하고 있나요?`} subtitle="운동 패턴을 알려주세요." onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="exercise.frequency"
        render={({ field }) => (
          <Picker
            label="보통 주에 몇 번 운동하시나요?"
            value={field.value}
            onChange={field.onChange}
            placeholder="운동 빈도를 선택해주세요"
            options={[
              { label: "1회", value: "1" },
              { label: "2회", value: "2" },
              { label: "3회", value: "3" },
              { label: "4회", value: "4" },
              { label: "5회", value: "5" },
              { label: "6회", value: "6" },
              { label: "7회", value: "7" },
            ]}
            error={(errors.exercise as any)?.frequency?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="exercise.duration"
        render={({ field }) => (
          <Picker
            label="한 번 운동할 때 몇 분 정도 하시나요?"
            value={field.value}
            onChange={field.onChange}
            placeholder="운동 시간을 선택해주세요"
            options={[
              { label: "30분", value: "30" },
              { label: "1시간", value: "60" },
              { label: "1시간 30분", value: "90" },
              { label: "2시간 이상", value: "120" },
            ]}
            error={(errors.exercise as any)?.duration?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="exercise.intensity"
        render={({ field }) => (
          <Selector<ExerciseIntensity>
            label="운동 강도는 어떤 정도인가요?"
            value={field.value}
            onChange={field.onChange}
            options={EXERCISE_INTENSITY_OPTIONS}
            error={(errors.exercise as any)?.intensity?.message as string}
          />
        )}
      />
    </UserFormLayout>
  );
};

export default Step5_1_ExerciseDetail;
