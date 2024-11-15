"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormField } from "@/ui/molecules/common/FormField";
import { Button } from "@/ui/atoms/button";

interface FormFilterValues {
  licensePlate: string;
  year: string;
  make: string;
  model: string;
}

interface FormFilterProps {
  onSubmit: (data: FormFilterValues) => void;
}

export default function FormFilter({ onSubmit }: FormFilterProps) {
  const { control, handleSubmit, reset } = useForm<FormFilterValues>({
    defaultValues: {
      licensePlate: "",
      year: "",
      make: "",
      model: "",
    },
  });

  const handleReset = () => {
    reset();
    onSubmit({ licensePlate: "", year: "", make: "", model: "" }); // Limpia los filtros
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center gap-9">
      <FormField label="License Plate" type="text" name="licensePlate" control={control} />
      <FormField label="Year" type="text" name="year" control={control} />
      <FormField label="Make" type="text" name="make" control={control} />
      <FormField label="Model" type="text" name="model" control={control} />

      <div className="flex gap-5 items-center justify-center align-middle">
        <Button type="submit" variant="primary">Filter</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
}
