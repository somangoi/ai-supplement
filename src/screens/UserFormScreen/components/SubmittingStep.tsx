import React, { useEffect } from "react";
import UserFormLayout from "./UserFormLayout";
import Typography from "@/components/Typography";
import { HealthInput } from "../schemas";

const SubmittingStep = ({ initialData }: { initialData: Partial<HealthInput> }) => {
  useEffect(() => {
    console.log(initialData);
  }, [initialData]);

  return (
    <UserFormLayout title="영양제 추천 중..." subtitle="입력하신 정보를 바탕으로 영양제 추천을 진행하고 있어요">
      <Typography name="3xl" text="🤔" color="text" containerStyle={{ alignItems: "center" }} />
    </UserFormLayout>
  );
};

export default SubmittingStep;
