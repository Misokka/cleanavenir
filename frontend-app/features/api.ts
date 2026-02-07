interface HttpClientResponse<T>{
  data: T;
  status: number;
  ok: boolean;
}

class HttpClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  }

  async post<T, U = unknown>(endpoint: string, data: U): Promise<HttpClientResponse<T>> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Inclure les cookies pour les sessions
    });

    return {
      data: await response.json(),
      status: response.status,
      ok: response.ok,
    };
  }

  async get<T>(endpoint: string): Promise<HttpClientResponse<T>> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      credentials: "include", // Inclure les cookies pour les sessions
    });
    return {
      data: await response.json(),
      status: response.status,
      ok: response.ok,
    };
  }

  async put<T, U = unknown>(endpoint: string, data: U): Promise<HttpClientResponse<T>> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Inclure les cookies pour les sessions
    });

    return {
      data: await response.json(),
      status: response.status,
      ok: response.ok,
    };
  }

  async remove<T>(endpoint: string): Promise<HttpClientResponse<T>> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "DELETE",
      credentials: "include", // Inclure les cookies pour les sessions
    });

    return {
      data: await response.json(),
      status: response.status,
      ok: response.ok,
    };
  }
}

const httpClient = new HttpClient();

export default httpClient;