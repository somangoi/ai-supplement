import styled from "@emotion/native";
import { theme } from "@/shared/styles/theme";

export interface MultiSelectorOption {
  value: string;
  label: string;
  icon?: string;
}

interface MultiSelectorProps {
  label?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectorOption[];
  error?: string;
  minSelection?: number;
}

export function MultiSelector({ label, value = [], onChange, options, error, minSelection = 0 }: MultiSelectorProps) {
  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      // 최소 선택 개수 체크
      if (value.length > minSelection) {
        onChange(value.filter((v) => v !== optionValue));
      }
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <OptionsContainer>
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <OptionTag key={option.value} selected={isSelected} onPress={() => handleToggle(option.value)} activeOpacity={0.7}>
              {option.icon && <IconText>{option.icon}</IconText>}
              <OptionText selected={isSelected}>{option.label}</OptionText>
            </OptionTag>
          );
        })}
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
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const OptionTag = styled.TouchableOpacity<{ selected: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ selected }) => (selected ? theme.colors.primary : theme.colors.background)};
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const IconText = styled.Text`
  font-size: 16px;
`;

const OptionText = styled.Text<{ selected: boolean }>`
  font-size: ${theme.fontSize.sm};
  font-weight: ${({ selected }) => (selected ? theme.fontWeight.semibold : theme.fontWeight.normal)};
  color: ${({ selected }) => (selected ? theme.colors.background : theme.colors.text)};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  margin-top: ${theme.spacing.xs};
`;
