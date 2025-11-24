import styled from "@emotion/native";
import { theme } from "@/styles/theme";

export interface SelectorOption<T = string | number | boolean> {
  value: T;
  label: string;
  icon?: string;
}

interface SelectorProps<T = string | number> {
  label?: string;
  value?: T;
  onChange: (value: T) => void;
  options: SelectorOption<T>[];
  error?: string;
}

export function Selector<T extends string | number = string | number>({ label, value, onChange, options, error }: SelectorProps<T>) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <OptionsContainer>
        {options.map((option) => (
          <OptionButton key={String(option.value)} selected={value === option.value} onPress={() => onChange(option.value)} activeOpacity={0.7}>
            {option.icon && <IconText>{option.icon}</IconText>}
            <OptionText selected={value === option.value}>{option.label}</OptionText>
          </OptionButton>
        ))}
      </OptionsContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.Text`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const OptionsContainer = styled.View`
  flex-direction: row;
  gap: ${theme.spacing.sm};
`;

const OptionButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ selected }) => (selected ? theme.colors.primary + "10" : theme.colors.background)};
  align-items: center;
`;

const IconText = styled.Text`
  font-size: 32px;
  margin-bottom: ${theme.spacing.xs};
`;

const OptionText = styled.Text<{ selected: boolean }>`
  font-size: ${theme.fontSize.base};
  font-weight: ${({ selected }) => (selected ? theme.fontWeight.semibold : theme.fontWeight.normal)};
  color: ${({ selected }) => (selected ? theme.colors.primary : theme.colors.text)};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  margin-top: ${theme.spacing.xs};
`;
