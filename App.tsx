import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/lib/queryClient";
import UserFormScreen from "@/screens/UserFormScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <UserFormScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
