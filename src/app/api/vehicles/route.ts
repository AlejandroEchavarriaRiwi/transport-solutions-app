import { NextResponse } from "next/server";
import { vehicleService } from "@/app/infrastructure/services/vehicles.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const itemsPerPage = searchParams.get("itemsPerPage") || "10";
    const filters = Object.fromEntries(searchParams.entries());

    // Obtener sesión
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Obtener los vehículos
    const data = await vehicleService.getAllVehicles(
      Number(page),
      Number(itemsPerPage),
      filters as Partial<{ licensePlate: string; year: string; make: string; model: string }>,
      token
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ message: "Error fetching vehicles", error }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const token = session?.user?.token;
  
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const formData = await req.formData();
  
      // Crear una nueva instancia de FormData
      const vehicleFormData = new FormData();
      vehicleFormData.append("make", formData.get("make") as string);
      vehicleFormData.append("model", formData.get("model") as string);
      vehicleFormData.append("year", formData.get("year") as string);
      vehicleFormData.append("licensePlate", formData.get("licensePlate") as string);
  
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ message: "File is required" }, { status: 400 });
      }
      vehicleFormData.append("file", file);
  
      // Enviar FormData al servicio
      const result = await vehicleService.addVehicle(vehicleFormData, token);
  
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error("Error creating vehicle:", error);
      return NextResponse.json({ message: "Error creating vehicle", error }, { status: 500 });
    }
  }
  