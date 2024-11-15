"use client";

import { useState } from "react";
import { Datum } from "@/app/core/application/dto/common/vehicles-response.dto";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import AddVehicleForm from "@/ui/molecules/common/AddVehicleForm";
import Modal from "@/ui/atoms/modal";

interface VehiclesTableProps {
  vehicles: Datum[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetchVehicles: () => void; // Función para recargar la lista de vehículos
}

const VehiclesTable = ({
  vehicles,
  totalPages,
  currentPage,
  setCurrentPage,
  refetchVehicles,
}: VehiclesTableProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleAddVehicle = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    refetchVehicles(); // Asegura que la tabla se recargue al cerrar el modal
  };

  const handleDownloadReport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vehicles Report");

    worksheet.columns = [
      { header: "Photo", key: "photo", width: 30 },
      { header: "Make", key: "make", width: 20 },
      { header: "Model", key: "model", width: 20 },
      { header: "Year", key: "year", width: 10 },
      { header: "License Plate", key: "licensePlate", width: 20 },
    ];

    vehicles.forEach((vehicle) => {
      worksheet.addRow({
        photo: vehicle.photo || "No available",
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
      });
    });

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Vehicles_Report_${new Date().toISOString()}.xlsx`);
  };

  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleAddVehicle}
        >
          Add Vehicle
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleDownloadReport}
        >
          Download Report
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded-lg text-center">
        <thead>
          <tr className="bg-gray-100">
            <th>Photo</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>License Plate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td>
                  <img
                    src={vehicle.photo || "/nocar.jpg"}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="h-20 object-cover"
                  />
                </td>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.licensePlate}</td>
                <td>
                  <button className="text-blue-500 hover:text-blue-700">
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700 ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No vehicles available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <AddVehicleForm
            onClose={handleCloseModal}
            onSuccess={() => console.log("Vehicle Added!")}
            refetchVehicles={refetchVehicles}
          />
        </Modal>
      )}
    </div>
  );
};

export default VehiclesTable;
