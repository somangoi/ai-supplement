import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import styled from "@emotion/native";
import { theme } from "@/shared/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";

interface LayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, scrollable = true }) => {
  return (
    <Container>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ContentWrapper>{children}</ContentWrapper>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ContentWrapper = styled.View`
  flex: 1;
`;
