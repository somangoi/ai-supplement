import React from "react";
import { ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import styled from "@emotion/native";
import { theme } from "@/styles/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = "primary", size = "md", disabled = false, loading = false, fullWidth = false, style }) => {
  return (
    <StyledButton onPress={onPress} variant={variant} size={size} disabled={disabled || loading} fullWidth={fullWidth} activeOpacity={0.7} style={style}>
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? theme.colors.primary : theme.colors.background} />
      ) : (
        <ButtonText variant={variant} size={size}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
};

const ButtonText = styled.Text<{
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
}>`
  color: ${({ variant }) => (variant === "outline" ? theme.colors.primary : theme.colors.background)};
  font-size: ${({ size }) => {
    if (size === "sm") return theme.fontSize.sm;
    if (size === "lg") return theme.fontSize.lg;
    return theme.fontSize.base;
  }};
  font-weight: ${theme.fontWeight.semibold};
`;

const StyledButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
  disabled: boolean;
  fullWidth: boolean;
}>`
  background-color: ${({ variant, disabled }) => {
    if (disabled) return theme.colors.surface;
    if (variant === "primary") return theme.colors.primary;
    if (variant === "secondary") return theme.colors.secondary;
    return "transparent";
  }};
  border-width: ${({ variant }) => (variant === "outline" ? "1px" : "0px")};
  border-color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  padding-top: ${({ size }) => {
    if (size === "sm") return theme.spacing.sm;
    if (size === "lg") return theme.spacing.lg;
    return theme.spacing.md;
  }};
  padding-bottom: ${({ size }) => {
    if (size === "sm") return theme.spacing.sm;
    if (size === "lg") return theme.spacing.lg;
    return theme.spacing.md;
  }};
  padding-left: ${({ size }) => {
    if (size === "sm") return theme.spacing.md;
    if (size === "lg") return theme.spacing.xl;
    return theme.spacing.lg;
  }};
  padding-right: ${({ size }) => {
    if (size === "sm") return theme.spacing.md;
    if (size === "lg") return theme.spacing.xl;
    return theme.spacing.lg;
  }};
  align-items: center;
  justify-content: center;
  align-self: ${({ fullWidth }) => (fullWidth ? "stretch" : "auto")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
