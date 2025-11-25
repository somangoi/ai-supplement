import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import styled from "@emotion/native";
import { theme } from "@/shared/styles/theme";

interface PickerOption {
  label: string;
  value: string | number;
}

interface PickerProps {
  label?: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  options: PickerOption[];
  placeholder?: string;
  error?: string;
}

export const Picker: React.FC<PickerProps> = ({ label, value, onChange, options, placeholder, error }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <PickerContainer hasError={!!error}>
        <RNPicker
          selectedValue={value}
          onValueChange={(itemValue) => {
            if (itemValue !== null && itemValue !== undefined) {
              onChange(itemValue);
            }
          }}
          style={styles.picker}
        >
          {placeholder && <RNPicker.Item label={placeholder} value={null} enabled={false} />}
          {options.map((option) => (
            <RNPicker.Item key={String(option.value)} label={option.label} value={option.value} />
          ))}
        </RNPicker>
      </PickerContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.Text`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`;

const PickerContainer = styled.View`
  border-width: 1px;
  border-color: ${({ hasError }: { hasError?: boolean }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background};
  overflow: hidden;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  margin-top: ${theme.spacing.xs};
`;

const styles = StyleSheet.create({
  picker: {
    height: Platform.OS === "ios" ? 180 : 50,
  },
});
