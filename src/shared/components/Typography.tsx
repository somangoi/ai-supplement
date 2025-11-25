import styled from "@emotion/native";
import { theme } from "@/shared/styles/theme";
import { TextProps, TextStyle, ViewStyle } from "react-native";

export interface TypographyProps {
  color: keyof typeof theme.colors | string;
  name: keyof typeof theme.fontSize;
  text: string;
  textProps?: TextProps;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  lineHeightPixel?: number;
}

const Typography = (props: TypographyProps) => {
  const { color, name, lineHeightPixel, text, textProps = {}, style = {}, containerStyle = {} } = props;

  return (
    <Container style={containerStyle}>
      <Text name={name} color={color} lineHeightPixel={lineHeightPixel} {...textProps} style={style}>
        {text}
      </Text>
    </Container>
  );
};

const Container = styled.View``;

const Text = styled.Text<{
  name: keyof typeof theme.fontSize;
  color: string;
  lineHeightPixel: number | undefined;
}>`
  color: ${({ color }) => color};
  font-size: ${({ name }) => theme.fontSize[name]};
  ${({ lineHeightPixel }) => lineHeightPixel && `line-height: ${lineHeightPixel};`}
`;

export default Typography;
