import { HealthInput } from "./schemas";

export interface StepComponentProps {
  initialData?: Partial<HealthInput>;
  onNext: (data: Partial<HealthInput>) => void;
  onPrev?: (data?: Partial<HealthInput>) => void;
}
