import { useImmerReducer } from "use-immer";
import { formReducer, type FormState, type FormEvent, STEP_CONFIG, getStepProgress } from "@/features/user-form/utils/formMachine";
import IntroStep from "@/features/user-form/components/IntroStep";
import Step1_BasicInfo from "@/features/user-form/components/Step1_BasicInfo";
import Step2_BodyInfo from "@/features/user-form/components/Step2_BodyInfo";
import Step3_Medications from "@/features/user-form/components/Step3_Medications";
import Step4_Concerns from "@/features/user-form/components/Step4_Concerns";
import Step5_Exercise from "@/features/user-form/components/Step5_Exercise";
import Step5_1_ExerciseDetail from "@/features/user-form/components/Step5_1_ExerciseDetail";
import Step6_SleepPattern from "@/features/user-form/components/Step6_SleepPattern";
import { Layout } from "@/shared/components/Layout";
import { theme } from "@/shared/styles/theme";
import styled from "@emotion/native";
import { HealthInput } from "@/features/user-form/types/schemas";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/shared/types/navigation";

const STEP_COMPONENTS = {
  intro: IntroStep,
  basicInfo: Step1_BasicInfo,
  bodyInfo: Step2_BodyInfo,
  medications: Step3_Medications,
  concerns: Step4_Concerns,
  exercise: Step5_Exercise,
  exerciseDetail: Step5_1_ExerciseDetail,
  sleepPattern: Step6_SleepPattern,
} as const;

export default function UserFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [state, dispatch] = useImmerReducer<FormState, FormEvent>(formReducer, {
    step: "intro" as const,
    context: {},
  });

  // 공통 핸들러
  const handleNext = (data: Partial<HealthInput>) => dispatch({ type: "NEXT", data });
  const handlePrev = (data?: Partial<HealthInput>) => dispatch({ type: "PREV", data });

  // 제출 핸들러 (마지막 단계 전용)
  const handleSubmit = (data: Partial<HealthInput>) => {
    dispatch({ type: "NEXT", data });
    navigation.navigate("Result", { formData: { ...state.context, ...data } as HealthInput });
  };

  // 현재 step의 컴포넌트 렌더링
  const renderStep = () => {
    const config = STEP_CONFIG[state.step];
    if (!config) return null;

    const Component = STEP_COMPONENTS[state.step];
    if (!Component) return null;

    const isIntro = state.step === "intro";

    return (
      <Component
        initialData={!isIntro ? state.context : undefined}
        onNext={config.hasSubmit ? handleSubmit : handleNext}
        onPrev={!isIntro ? handlePrev : undefined}
      />
    );
  };

  return (
    <Layout>
      <ProgressBar>
        <ProgressFill style={{ width: `${getStepProgress(state.step)}%` }} />
      </ProgressBar>
      <Container>{renderStep()}</Container>
    </Layout>
  );
}

const ProgressBar = styled.View`
  height: 10px;
  background-color: ${theme.colors.surface};
  width: 100%;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: ${theme.colors.primary};
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const Container = styled.View`
  flex: 1;
`;
