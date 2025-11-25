import React from "react";
import { TextInputProps } from "react-native";
import styled from "@emotion/native";
import { theme } from "@/shared/styles/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

const Container = styled.View`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.Text`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`;

const StyledInput = styled.TextInput<{ hasError: boolean }>`
  border-width: 1px;
  border-color: ${({ hasError }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.text};
  background-color: ${theme.colors.background};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  margin-top: ${theme.spacing.xs};
`;

const HelperText = styled.Text`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.xs};
  margin-top: ${theme.spacing.xs};
`;

export const Input: React.FC<InputProps> = ({ label, error, helperText, ...props }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledInput hasError={!!error} placeholderTextColor={theme.colors.textSecondary} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </Container>
  );
};
