import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/components/Input";
import { Selector } from "@/shared/components/Selector";
import { Picker } from "@/shared/components/Picker";
import { healthInputSchema, getGenderOptions, type Gender } from "../types/schemas";
import UserFormLayout from "./UserFormLayout";
import { StepComponentProps } from "../types";
import { useStepForm } from "../hooks/useStepForm";
import Typography from "@/shared/components/Typography";

const GENDER_OPTIONS = getGenderOptions();

// 현재 년도부터 100년 전까지의 년도 옵션 생성
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const options: { label: string; value: number }[] = [];
  for (let year = currentYear; year >= currentYear - 100; year--) {
    options.push({ label: `${year}년`, value: year });
  }
  return options;
};

const YEAR_OPTIONS = generateYearOptions();

const DEFAULT_BIRTH_YEAR = 2000; // 2000년생

const Step1_BasicInfo = (props: StepComponentProps) => {
  const { initialData } = props;
  const {
    control,
    handlePrev,
    handleNext,
    formState: { errors },
  } = useStepForm<{ name: string; birthYear: number; gender: "male" | "female" | "other" }>(props, {
    defaultValues: {
      name: initialData?.name,
      birthYear: initialData?.birthYear ?? DEFAULT_BIRTH_YEAR,
      gender: initialData?.gender,
    },
    resolver: zodResolver(healthInputSchema.pick({ name: true, birthYear: true, gender: true })),
  });

  return (
    <UserFormLayout title="기본 정보" subtitle="정확한 추천을 위해 기본 정보를 알려주세요" onPrev={handlePrev} onNext={handleNext}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, onBlur } }) => (
          <Input label="이름" value={value || ""} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message as string} placeholder="김알고" />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => <Selector<Gender> label="성별" value={value} onChange={onChange} options={GENDER_OPTIONS} error={errors.gender?.message as string} />}
      />

      <Controller
        control={control}
        name="birthYear"
        render={({ field: { onChange, value } }) => {
          const currentYear = new Date().getFullYear();
          const age = value ? currentYear - value : null;
          return (
            <>
              <Picker
                label="출생년도"
                value={value}
                onChange={(val) => onChange(val as number)}
                placeholder="출생년도를 선택하세요"
                options={YEAR_OPTIONS}
                error={errors.birthYear?.message as string}
              />
              {!errors.birthYear && age !== null && <Typography name="xs" color="textSecondary" text={`만 ${age}세`} />}
            </>
          );
        }}
      />
    </UserFormLayout>
  );
};

export default Step1_BasicInfo;
