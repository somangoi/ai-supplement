import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/Input";
import { healthInputSchema } from "../types/schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";

const Step3_Medications = (props: StepComponentProps) => {
  const { initialData } = props;
  const { control, handlePrev, handleNext } = useStepForm(props, {
    defaultValues: {
      medications: initialData?.medications,
    },
    resolver: zodResolver(healthInputSchema.pick({ medications: true })),
  });

  return (
    <UserFormLayout title={`${initialData?.name}님은 복용하는 약이 있나요?`} subtitle="복용 중인 약이 있다면 쉼표로 구분하여 입력해주세요." onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="medications"
        render={({ field }) => <Input label="복용 중인 약[선택]" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} placeholder="예: 아스피린, 피임약" keyboardType="default" />}
      />
    </UserFormLayout>
  );
};

export default Step3_Medications;
