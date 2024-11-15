// app/utils/httpClient.ts
export class HttpClient {
    private baseUrl: string;
  
    constructor(baseUrl?: string) {
      this.baseUrl = baseUrl || "https://maintenancesystembc-production.up.railway.app/api/v1";
    }
  
    private async getHeader(token?: string, isFormData = false) {
      const headers: Record<string, string> = {};
  
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }
  
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
  
      return headers;
    }
  
    async get<T>(url: string, token: string): Promise<T> {
      const headers = await this.getHeader(token);
      const response = await fetch(`${this.baseUrl}/${url}`, {
        headers,
        method: "GET",
        cache: "no-store",
      });
      return this.handleResponse(response);
    }
  
    async post<T, B>(url: string, body: B, token?: string): Promise<T> {
      const isFormData = body instanceof FormData;
      const headers = await this.getHeader(token, isFormData);
      const response = await fetch(`${this.baseUrl}/${url}`, {
        headers,
        method: "POST",
        body: isFormData ? body : JSON.stringify(body),
      });
      return this.handleResponse(response);
    }
  
    private async handleResponse(response: Response) {
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      return await response.json();
    }
  }
  