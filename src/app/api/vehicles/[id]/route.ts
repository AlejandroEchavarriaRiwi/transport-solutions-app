// app/api/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import { vehicleService } from "@/app/infrastructure/services/vehicles.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Endpoint para obtener los detalles del vehículo por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Obtener sesión para token de autenticación
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Obtener los detalles del vehículo
    const vehicleData = await vehicleService.getVehicleById(id, token);

    return NextResponse.json(vehicleData);
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    return NextResponse.json({ message: "Error fetching vehicle details", error }, { status: 500 });
  }
}
