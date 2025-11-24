import { Button } from "@/components/Button";
import styled from "@emotion/native";
import { theme } from "@/styles/theme";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  prevTitle?: string;
  nextTitle?: string;
}

const PrevNextButton = ({ onPrev, onNext, prevTitle = "이전", nextTitle = "다음" }: Props) => {
  return (
    <ButtonContainer>
      <Button title={prevTitle} onPress={onPrev} variant="outline" fullWidth={true} style={{ flex: 1 }} />
      <Button title={nextTitle} onPress={onNext} variant="primary" fullWidth={true} style={{ flex: 1 }} />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.View`
  margin-top: ${theme.spacing.lg};
  flex-direction: row;

  gap: ${theme.spacing.md};
`;

export default PrevNextButton;
