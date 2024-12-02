"use client";
import { memo } from "react";
import { Control, FieldValues, useController } from "react-hook-form";

const ErrorMessage = ({
  name,
  control,
  rules,
}: {
  name: string;
  control: Control<FieldValues>;
  rules: any;
}) => {
  const {
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  console.log("rules", rules);

  return <>{error && <p className="text-rose-600">{rules.message}</p>}</>;
};

export default memo(ErrorMessage);
