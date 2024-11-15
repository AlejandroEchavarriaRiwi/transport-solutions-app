// app/api/vehicles/[id]/maintenance/route.ts
import { NextResponse } from "next/server";
import { vehicleService } from "@/app/infrastructure/services/vehicles.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Endpoint para obtener los detalles de mantenimiento de un vehículo
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Obtener sesión para token de autenticación
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Obtener detalles de mantenimiento del vehículo
    const maintenanceData = await vehicleService.getVehicleMaintenanceById(id, token);

    return NextResponse.json(maintenanceData);
  } catch (error) {
    console.error("Error fetching vehicle maintenance details:", error);
    return NextResponse.json({ message: "Error fetching maintenance details", error }, { status: 500 });
  }
}
