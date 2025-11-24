import { theme } from "@/styles/theme";
import styled from "@emotion/native";
import React from "react";
import PrevNextButton from "./PrevNextButton";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  prevTitle?: string;
  nextTitle?: string;
}

const UserFormLayout = ({ title, subtitle, children, onPrev, onNext, prevTitle = "이전", nextTitle = "다음" }: Props) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <FormSection>{children}</FormSection>
      {onPrev && onNext && <PrevNextButton onPrev={onPrev} onNext={onNext} prevTitle={prevTitle} nextTitle={nextTitle} />}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`;

const Subtitle = styled.Text`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  line-height: 24px;
`;

const FormSection = styled.View`
  flex: 1;
`;

export default UserFormLayout;
