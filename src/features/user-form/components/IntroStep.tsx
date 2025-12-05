import { Button } from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";
import { theme } from "@/shared/styles/theme";
import styled from "@emotion/native";
import { StepComponentProps } from "../types";

const IntroStep = ({ onNext }: StepComponentProps) => {
  return (
    <Container>
      <TextWrapper>
        <Typography color="text" name="lg" text="생활 패턴과 건강 상태를 분석하여" containerStyle={{ alignItems: "center" }} />
        <Typography color="text" name="lg" text="영양제 추천을 해드립니다." containerStyle={{ alignItems: "center" }} />
      </TextWrapper>
      <ButtonContainer>
        <Button title="시작하기" onPress={() => onNext({})} />
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const TextWrapper = styled.View`
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: 4px;
`;

const ButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex-direction: row;
`;

export default IntroStep;
