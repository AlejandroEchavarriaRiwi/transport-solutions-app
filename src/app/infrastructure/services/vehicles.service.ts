import { HttpClient } from "../utils/httpClient";
import { IGetVehicles, Datum } from "@/app/core/application/dto/common/vehicles-response.dto";
import { IGetMaintenance } from "@/app/core/application/dto/common/maintenance-response.dto";
import { IGetVehicleByID } from "@/app/core/application/dto/common/vehiclebyid.dto";

const httpClient = new HttpClient();

export const vehicleService = {
  async getAllVehicles(
    page: number = 1,
    itemsPerPage: number = 10,
    filters: Partial<{ licensePlate: string; year: string; make: string; model: string }> = {},
    token: string
  ): Promise<IGetVehicles> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      ...filters,
    });

    return await httpClient.get<IGetVehicles>(`vehicles?${queryParams}`, token);
  },
  
  async addVehicle(vehicleData: FormData, token: string) {
    return await new HttpClient().post<FormData, any>(`vehicles`, vehicleData, token);
  },

  // Obtener los detalles del vehículo por ID
  async getVehicleById(id: string, token: string): Promise<IGetVehicleByID> {
    return await httpClient.get<IGetVehicleByID>(`vehicles/${id}`, token); // Este endpoint devuelve los detalles del vehículo
  },

  // Obtener los detalles de mantenimiento del vehículo por ID
  async getVehicleMaintenanceById(id: string, token: string): Promise<IGetMaintenance> {
    return await httpClient.get<IGetMaintenance>(`vehicles/${id}/maintenance`, token); // Este endpoint devuelve los detalles de mantenimiento
  },
};
