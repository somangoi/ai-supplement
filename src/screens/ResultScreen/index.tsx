import { useNavigation, useRoute } from "@react-navigation/native";
import { Layout } from "@/shared/components/Layout";
import { useSupplementAdvisor } from "@/features/supplement-advisor/api/queries";
import Loading from "@/features/supplement-advisor/components/Loading";
import ErrorComponent from "@/features/supplement-advisor/components/Error";
import Result from "@/features/supplement-advisor/components/Result";
import { LLMResponseError } from "@/features/supplement-advisor/types/errors";
import type { RootStackParamList, ResultScreenProps } from "@/shared/types/navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<ResultScreenProps["route"]>();

  // formData 없으면 바로 돌아가기
  if (!params?.formData) {
    navigation.navigate("UserForm");
    return null;
  }

  const formData = params.formData;

  const { data, isLoading, isError, error, refetch } = useSupplementAdvisor({
    formData,
    enabled: true, // 화면 진입 시 자동 fetch
  });

  return (
    <Layout scrollable={false}>
      {isLoading && <Loading />}
      {isError && (
        <ErrorComponent
          onRetry={refetch}
          onGoBack={() => navigation.navigate("UserForm")}
          errorMessage={error?.message}
          rawResponse={error instanceof LLMResponseError ? error.rawResponse : undefined}
          errorType={error instanceof LLMResponseError ? error.errorType : undefined}
        />
      )}
      {data && <Result result={data} userName={formData?.name} onReset={() => navigation.navigate("UserForm")} />}
    </Layout>
  );
}
