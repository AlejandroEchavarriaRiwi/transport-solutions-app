'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/ui/molecules/common/FormField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface AddVehicleFormData {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  file: File;
}

const vehicleSchema = yup.object({
  make: yup.string().required("La marca es obligatoria"),
  model: yup.string().required("El modelo es obligatorio"),
  year: yup
    .string()
    .required("El año es obligatorio")
    .matches(/^\d{4}$/, "El año debe ser un número de 4 dígitos"),
  licensePlate: yup.string().required("La placa es obligatoria"),
  file: yup.mixed<File>().required("El archivo es obligatorio"),
});

export default function AddVehicleForm({
  onClose,
  onSuccess,
  refetchVehicles,
}: {
  onClose: () => void;
  onSuccess: () => void;
  refetchVehicles: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<AddVehicleFormData>({
    resolver: yupResolver(vehicleSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileClear = () => {
    setPreview(null);
    setValue("file", null as unknown as File); // Resetea el valor del archivo
  };

  const onSubmit = async (data: AddVehicleFormData) => {
    const formData = new FormData();
    formData.append("make", data.make);
    formData.append("model", data.model);
    formData.append("year", data.year);
    formData.append("licensePlate", data.licensePlate);
    formData.append("file", data.file);

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Vehicle successfully created!", { autoClose: 3000 });
        onSuccess(); // Llama a la acción de éxito
        onClose(); // Cierra el modal
        refetchVehicles(); // Recarga la lista
      } else {
        toast.error("Failed to add vehicle. Please try again.");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("An error occurred while adding the vehicle.");
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto p-6 space-y-4 bg-white rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Agregar nuevo vehiculo
        </h2>

        <div className="flex justify-center mb-4">
          <Avatar
            src={preview || "/default-avatar.jpg"}
            alt="Vehicle Preview"
            sx={{ width: 80, height: 80 }}
          />
        </div>

        <div className="flex gap-4 justify-center mb-2">
          <Button variant="contained" component="label" color="primary">
            Cargar
            <input
              type="file"
              accept="image/jpeg, image/png"
              hidden
              {...register("file")}
              onChange={handleFileChange}
            />
          </Button>
          <Button variant="contained" color="error" onClick={handleFileClear}>
            Cancelar
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500">
          Solo se aceptan archivos en formato jpg, png
        </p>
        {errors.file && <span className="text-red-500">{errors.file.message}</span>}

        <FormField
          control={control}
          type="text"
          label="Marca"
          name="make"
          placeholder="Ingresa la marca"
          error={errors.make}
        />

        <FormField
          control={control}
          type="text"
          label="Modelo"
          name="model"
          placeholder="Ingresa el modelo"
          error={errors.model}
        />

        <FormField
          control={control}
          type="number"
          label="Año"
          name="year"
          placeholder="Ingresa el año"
          error={errors.year}
        />

        <FormField
          control={control}
          type="text"
          label="Placa"
          name="licensePlate"
          placeholder="Ingresa la placa"
          error={errors.licensePlate}
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            className="w-32"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" className="w-32">
            Agregar
          </Button>
        </div>
      </form>
    </>
  );
}
