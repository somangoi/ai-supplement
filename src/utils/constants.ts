// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";
export const API_TIMEOUT = 30000; // 30 seconds

// App Configuration
export const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK === "true" || true;

// Theme Colors
export const COLORS = {
  primary: "#007AFF",
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  text: "#000000",
  textSecondary: "#666666",
  border: "#CCCCCC",
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
