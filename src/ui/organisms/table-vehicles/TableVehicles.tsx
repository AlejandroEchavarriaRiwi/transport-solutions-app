'use client'

import { useState } from "react"
import { Datum } from "@/app/core/application/dto/common/vehicles-response.dto"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import AddVehicleForm from "@/ui/molecules/common/AddVehicleForm"
import Modal from "@/ui/atoms/modal"
import { useRouter } from "next/navigation"

interface VehiclesTableProps {
  vehicles: Datum[]
  totalPages: number
  currentPage: number
  setCurrentPage: (page: number) => void
  refetchVehicles: () => void
}

export default function VehiclesTable({
  vehicles,
  totalPages,
  currentPage,
  setCurrentPage,
  refetchVehicles,
}: VehiclesTableProps) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const handleAddVehicle = () => setShowModal(true)
  const handleCloseModal = () => {
    setShowModal(false)
    refetchVehicles()
  }

  const handleDownloadReport = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Vehicles Report")

    worksheet.columns = [
      { header: "Photo", key: "photo", width: 30 },
      { header: "Make", key: "make", width: 20 },
      { header: "Model", key: "model", width: 20 },
      { header: "Year", key: "year", width: 10 },
      { header: "License Plate", key: "licensePlate", width: 20 },
    ]

    vehicles.forEach((vehicle) => {
      worksheet.addRow({
        photo: vehicle.photo || "No available",
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
      })
    })

    worksheet.getRow(1).font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    saveAs(blob, `Vehicles_Report_${new Date().toISOString()}.xlsx`)
  }

  const handleMaintenance = (vehicleId: number) => {
    router.push(`/dashboard/management/${vehicleId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Vehicle Management</h1>
        <div className="flex gap-4">
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleAddVehicle}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Vehicle
          </button>
          <button
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleDownloadReport}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="min-w-full">
          <div className="border-b">
            <div className="grid grid-cols-6 bg-gray-50">
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
            </div>
          </div>
          <div>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <div key={vehicle.id} className="grid grid-cols-6 border-b hover:bg-gray-50">
                  <div className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={vehicle.photo || "/nocar.jpg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="h-20 w-32 object-cover rounded-md"
                    />
                  </div>
                  <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.make}</div>
                  <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.model}</div>
                  <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.year}</div>
                  <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.licensePlate}</div>
                  <div className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900 mr-2">Delete</button>
                    <button
                      onClick={() => handleMaintenance(vehicle.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Maintenance
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No vehicles available.</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-full ${
              currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } flex items-center justify-center focus:outline-none`}
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
  )
}