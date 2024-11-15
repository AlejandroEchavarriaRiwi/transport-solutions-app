import { useState, useEffect } from "react";
import { Datum, IGetVehicles } from "@/app/core/application/dto/common/vehicles-response.dto";
import { Filters } from "@/app/core/application/dto";

export function useVehicles(initialFilters: Filters = {}, itemsPerPage: number = 10) {
    const [vehicles, setVehicles] = useState<Datum[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchVehicles = async (page: number = 1) => {
      setLoading(true);
      setError(null);
  
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          itemsPerPage: itemsPerPage.toString(),
          ...filters,
        });
  
        const response = await fetch(`/api/vehicles?${params}`, {
          method: "GET",
          cache: "no-store",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
  
        const data: IGetVehicles = await response.json();
        setVehicles(data.data);
        setTotalPages(data.metadata.totalPages);
      } catch (err) {
        setError("Error fetching vehicles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchVehicles(currentPage);
    }, [filters, currentPage]);
  
    return {
      vehicles,
      currentPage,
      totalPages,
      filters,
      loading,
      error,
      setFilters,
      setCurrentPage,
      refetch: fetchVehicles,
    };
  }
  
