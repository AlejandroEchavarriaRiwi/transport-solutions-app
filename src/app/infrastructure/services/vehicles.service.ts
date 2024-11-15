// app/infrastructure/services/vehicles.service.ts
import { HttpClient } from "../utils/httpClient";
import { IGetVehicles, Datum } from "@/app/core/application/dto/common/vehicles-response.dto";

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
};
