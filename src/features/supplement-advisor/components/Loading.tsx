import styled from "@emotion/native";
import { theme } from "@/styles/theme";
import { ActivityIndicator } from "react-native";
import Typography from "@/components/Typography";

const Loading = () => {
  return (
    <LoadingContainer>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Typography text="딱 맞는 영양제를 찾고 있어요" name="lg" color={theme.colors.textSecondary} />
    </LoadingContainer>
  );
};

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export default Loading;
