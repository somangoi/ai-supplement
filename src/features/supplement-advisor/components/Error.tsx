import React from "react";
import styled from "@emotion/native";
import { theme } from "@/styles/theme";
import { Button } from "@/components/Button";
import Typography from "@/components/Typography";

interface ErrorProps {
  onRetry: () => void;
  onGoBack: () => void;
}

const ErrorComponent = ({ onRetry, onGoBack }: ErrorProps) => {
  return (
    <Container>
      <ErrorIcon>⚠️</ErrorIcon>
      <Typography
        text="문제가 발생했습니다"
        color={theme.colors.text}
        name="2xl"
        textProps={{ style: { fontWeight: theme.fontWeight.bold, textAlign: "center" } }}
        containerStyle={{ marginBottom: 8 }}
      />
      <Typography
        text="영양제 추천을 가져오는 중 오류가 발생했습니다."
        color={theme.colors.textSecondary}
        name="base"
        textProps={{ style: { fontWeight: theme.fontWeight.normal, textAlign: "center" } }}
        containerStyle={{ marginBottom: 50 }}
      />
      <ButtonContainer>
        <Button title="다시 시도" onPress={onRetry} />
        <SecondaryButtonWrapper>
          <Button title="처음으로 돌아가기" onPress={onGoBack} variant="outline" />
        </SecondaryButtonWrapper>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl};
`;

const ErrorIcon = styled.Text`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
`;

const ButtonContainer = styled.View`
  width: 100%;
`;

const SecondaryButtonWrapper = styled.View`
  margin-top: ${theme.spacing.md};
`;

export default ErrorComponent;
