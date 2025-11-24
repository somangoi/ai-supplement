import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { StepComponentProps } from "../types";

interface UseStepFormProps<T> {
  onNext: (data: T) => void;
  onPrev: (data?: Partial<T>) => void;
  initialData?: Partial<T>;
}

export function useStepForm<TFieldValues extends FieldValues>(props: UseStepFormProps<TFieldValues>, formConfig?: UseFormProps<TFieldValues>) {
  const { onNext, onPrev, initialData } = props;

  const form = useForm<TFieldValues>({
    defaultValues: initialData as any,
    ...formConfig,
  });

  const { handleSubmit, getValues } = form;

  const handlePrev = () => {
    const currentValues = getValues();

    onPrev(currentValues as unknown as Partial<TFieldValues>);
  };

  const handleNext = handleSubmit((data) => {
    onNext(data);
  });

  return {
    ...form,
    handlePrev,
    handleNext,
  };
}
