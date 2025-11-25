import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { queryClient } from "@/lib/queryClient";
import UserFormScreen from "@/screens/UserFormScreen";
import ResultScreen from "@/screens/ResultScreen";
import { RootStackParamList } from "@/shared/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="UserForm"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="UserForm" component={UserFormScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
