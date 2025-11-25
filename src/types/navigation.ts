import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HealthInput } from "@/features/user-form/types/schemas";

export type RootStackParamList = {
  UserForm: undefined;
  Result: { formData: HealthInput };
};

export type UserFormScreenProps = NativeStackScreenProps<RootStackParamList, "UserForm">;
export type ResultScreenProps = NativeStackScreenProps<RootStackParamList, "Result">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
