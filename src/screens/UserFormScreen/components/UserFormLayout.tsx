import { theme } from "@/styles/theme";
import styled from "@emotion/native";
import React from "react";
import { ScrollView } from "react-native";
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
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <ScrollContent>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
          <FormSection>{children}</FormSection>
        </ScrollContent>
      </ScrollView>
      {onPrev && onNext && (
        <Footer>
          <PrevNextButton onPrev={onPrev} onNext={onNext} prevTitle={prevTitle} nextTitle={nextTitle} />
        </Footer>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const ScrollContent = styled.View`
  padding: ${theme.spacing.md};
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
  padding-bottom: ${theme.spacing.md};
`;

const Footer = styled.View`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
`;

export default UserFormLayout;
