import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Selector } from "@/components/Selector";
import { Picker } from "@/components/Picker";
import UserFormLayout from "./UserFormLayout";
import { healthInputSchema, getSleepQualityOptions, type SleepQuality } from "../schemas";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const SLEEP_QUALITY_OPTIONS = getSleepQualityOptions();
const Step6_SleepPattern = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{
    sleep: {
      hours: number;
      quality: "good" | "average" | "bad";
    };
  }>(props, {
    defaultValues: {
      sleep: {
        hours: initialData?.sleep?.hours,
        quality: initialData?.sleep?.quality,
      },
    },
    resolver: zodResolver(healthInputSchema.pick({ sleep: true })),
  });

  return (
    <UserFormLayout title="마지막으로 수면 패턴을 알려주세요" subtitle="하루 몇시간 자고, 수면의 질은 어떤가요?" onPrev={handlePrev} onNext={handleNext} nextTitle="제출하기">
      <Controller
        control={control}
        name="sleep.hours"
        render={({ field }) => (
          <Picker
            label="수면 시간"
            value={field.value}
            onChange={(val) => field.onChange(typeof val === "string" ? Number(val) : val)}
            placeholder="수면 시간을 선택해주세요"
            options={[
              { label: "3시간 이하", value: 3 },
              { label: "4시간", value: 4 },
              { label: "5시간", value: 5 },
              { label: "6시간", value: 6 },
              { label: "7시간", value: 7 },
              { label: "8시간 이상", value: 8 },
            ]}
            error={(errors.sleep as any)?.hours?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="sleep.quality"
        render={({ field }) => (
          <Selector<SleepQuality> label="수면 질" value={field.value} onChange={field.onChange} options={SLEEP_QUALITY_OPTIONS} error={(errors.sleep as any)?.quality?.message as string} />
        )}
      />
    </UserFormLayout>
  );
};

export default Step6_SleepPattern;
