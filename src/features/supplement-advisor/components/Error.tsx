import React, { useEffect } from "react";
import styled from "@emotion/native";
import { theme } from "@/shared/styles/theme";
import { Button } from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";

interface ErrorProps {
  onRetry: () => void;
  onGoBack: () => void;
  errorMessage?: string;
  rawResponse?: string;
  errorType?: "parsing" | "validation" | "api" | "network";
}

const ErrorComponent = ({ onRetry, onGoBack, errorMessage, rawResponse, errorType }: ErrorProps) => {
  useEffect(() => {
    console.group("🚨 Error Details");
    console.log("Type:", errorType || "unknown");
    console.log("Message:", errorMessage || "No message");
    if (rawResponse) {
      console.log("Raw Response:");
      console.log(rawResponse);
    }
    console.groupEnd();
  }, [errorType, errorMessage, rawResponse]);

  const getErrorTitle = () => {
    switch (errorType) {
      case "parsing":
        return "응답 파싱 실패";
      case "validation":
        return "데이터 검증 실패";
      case "network":
        return "네트워크 오류";
      case "api":
        return "API 호출 실패";
      default:
        return "문제가 발생했습니다";
    }
  };

  const getErrorDescription = () => {
    if (errorMessage) return errorMessage;
    return "영양제 추천을 가져오는 중 오류가 발생했습니다.";
  };

  return (
    <Container>
      <ContentContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <Typography
          text={getErrorTitle()}
          color={theme.colors.text}
          name="2xl"
          textProps={{ style: { fontWeight: theme.fontWeight.bold } }}
          containerStyle={{ marginBottom: 8, alignSelf: "center" }}
        />
        <Typography
          text={getErrorDescription()}
          color={theme.colors.textSecondary}
          name="base"
          textProps={{ style: { fontWeight: theme.fontWeight.normal } }}
          containerStyle={{ marginBottom: 24, alignSelf: "center" }}
        />

        <ButtonContainer>
          <Button title="다시 시도" onPress={onRetry} />
          <SecondaryButtonWrapper>
            <Button title="처음으로 돌아가기" onPress={onGoBack} variant="outline" />
          </SecondaryButtonWrapper>
        </ButtonContainer>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl};
`;

const ContentContainer = styled.View`
  width: 100%;
  max-width: 500px;
`;

const ErrorIcon = styled.Text`
  font-size: 64px;
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const ButtonContainer = styled.View`
  width: 100%;
`;

const SecondaryButtonWrapper = styled.View`
  margin-top: ${theme.spacing.md};
`;

export default ErrorComponent;
