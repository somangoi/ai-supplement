import { View } from "react-native";
import { useImmerReducer } from "use-immer";
import { formReducer, type FormState, type FormEvent } from "@/features/user-form/utils/formMachine";
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

export default function UserFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 상태 머신 초기화
  const [state, dispatch] = useImmerReducer<FormState, FormEvent>(formReducer, {
    step: "intro" as const,
    context: {},
  });

  // 단계별 렌더링 함수
  const renderStep = () => {
    // 마지막 단계에서만 제출 로직 처리
    const handleSleepPatternNext = (data: Partial<HealthInput>) => {
      dispatch({ type: "NEXT", data });
      // 데이터 업데이트 후 바로 navigation
      navigation.navigate("Result", { formData: { ...state.context, ...data } as HealthInput });
    };

    switch (state.step) {
      case "intro":
        return <IntroStep onNext={() => dispatch({ type: "NEXT", data: {} })} />;
      case "basicInfo":
        return <Step1_BasicInfo initialData={state.context} onNext={(data) => dispatch({ type: "NEXT", data })} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      case "bodyInfo":
        return <Step2_BodyInfo initialData={state.context} onNext={(data) => dispatch({ type: "NEXT", data })} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      case "medications":
        return <Step3_Medications initialData={state.context} onNext={(data) => dispatch({ type: "NEXT", data })} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      case "concerns":
        return <Step4_Concerns initialData={state.context} onNext={(data) => dispatch({ type: "NEXT", data })} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      case "exercise":
        return <Step5_Exercise initialData={state.context} onNext={(data) => dispatch({ type: "NEXT", data })} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      case "exerciseDetail":
        return <Step5_1_ExerciseDetail initialData={state.context} onNext={(data) => dispatch({ type: "NEXT", data })} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      case "sleepPattern":
        return <Step6_SleepPattern initialData={state.context} onNext={handleSleepPatternNext} onPrev={(data) => dispatch({ type: "PREV", data })} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <View style={{ height: 10, backgroundColor: theme.colors.surface, width: "100%" }}>
        <View style={{ height: "100%", backgroundColor: theme.colors.primary, width: (getProgress(state.step) as unknown as number) || 10, borderTopEndRadius: 8, borderEndEndRadius: 8 }} />
      </View>
      <Container>{renderStep()}</Container>
    </Layout>
  );
}

const getProgress = (step: string) => {
  const steps = ["basicInfo", "bodyInfo", "medications", "concerns", "exercise", "exerciseDetail", "sleepPattern"];
  const index = steps.indexOf(step);
  return `${((index + 1) / steps.length) * 100}%`;
};

const Container = styled.View`
  flex: 1;
`;
