'use client';

import VehiclesTable from "@/ui/organisms/table-vehicles/TableVehicles";
import FormFilter from "@/ui/organisms/form-filter/FormFilter";
import { useVehicles } from "@/hooks/useVehicles";

export default function VehiclesManagementPage() {
  const {
    vehicles,
    currentPage,
    totalPages,
    loading,
    error,
    setFilters,
    setCurrentPage,
  } = useVehicles(); // Hook personalizado para manejar lógica de vehículos

  const handleFilterSubmit = (filters: any) => {
    setFilters(filters); // Actualiza los filtros
    setCurrentPage(1);   // Reinicia a la primera página
  };

  return (
    <div className="w-full p-10">
      <h1 className="font-extrabold text-2xl mb-10">Vehicles Management</h1>

      <FormFilter onSubmit={handleFilterSubmit} />

      {loading && <p>Loading vehicles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <VehiclesTable
        vehicles={vehicles}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage} refetchVehicles={function (): void {
          throw new Error("Function not implemented.");
        } }      />
    </div>
  );
}
