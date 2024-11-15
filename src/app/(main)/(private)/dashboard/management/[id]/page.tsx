'use client'

import { useEffect, useState } from "react"

interface MaintenanceRecord {
  id: string
  date: string
  type: string
  mileage: number
  notes: string
}

interface VehicleData {
  data: {
    photo: string
    make: string
    model: string
    year: number
    licensePlate: string
  }
}

export default function VehicleDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const [vehicle, setVehicle] = useState<VehicleData | null>(null)
  const [maintenanceData, setMaintenanceData] = useState<{ data: MaintenanceRecord[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchVehicleDetails = async () => {
        try {
          setLoading(true)
          const [vehicleRes, maintenanceRes] = await Promise.all([
            fetch(`/api/vehicles/${id}`),
            fetch(`/api/vehicles/${id}/maintenance`)
          ])

          if (!vehicleRes.ok || !maintenanceRes.ok) {
            throw new Error('Failed to fetch data')
          }

          const [vehicleData, maintenanceData] = await Promise.all([
            vehicleRes.json(),
            maintenanceRes.json()
          ])

          setVehicle(vehicleData)
          setMaintenanceData(maintenanceData)
        } catch (error) {
          console.error("Error fetching vehicle details:", error)
          setError("There was an error loading the vehicle details.")
        } finally {
          setLoading(false)
        }
      }

      fetchVehicleDetails()
    }
  }, [id])

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  if (!vehicle) {
    return <div className="text-center p-4">No vehicle found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-8">Mantenimientos del vehículo</h1>
      
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start relative">
            <div className="w-full md:w-1/3">
              <img
                src={vehicle.data.photo || "/nocar.jpg"}
                alt={`${vehicle.data.make} ${vehicle.data.model}`}
                className="w-full aspect-[16/10] object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-sm text-gray-500 mb-1">Año:</p>
                <p className="font-medium">{vehicle.data.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Marca:</p>
                <p className="font-medium">{vehicle.data.make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Modelo:</p>
                <p className="font-medium">{vehicle.data.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Placa:</p>
                <p className="font-medium">{vehicle.data.licensePlate}</p>
              </div>
            </div>

            <button className="absolute top-6 right-0 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Descargar reporte
            </button>
          </div>
        </div>
      </div>

      <button className="mb-6 inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>
        Agregar registro
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="min-w-full">
          <div className="border-b">
            <div className="grid grid-cols-4 bg-gray-50">
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FECHA
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TIPO
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KILOMETRAJE
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NOTAS
              </div>
            </div>
          </div>
          <div>
            {maintenanceData?.data.map((maintenance) => (
              <div key={maintenance.id} className="grid grid-cols-4 border-b">
                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(maintenance.date).toLocaleDateString()}
                </div>
                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {maintenance.type}
                </div>
                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {maintenance.mileage.toLocaleString()} km
                </div>
                <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {maintenance.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {[1, 2, 3, 4].map((page) => (
          <div
            key={page}
            className={`w-2 h-2 rounded-full ${
              page === 1 ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}