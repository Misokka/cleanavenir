export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

class HttpClient {
  private readonly baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  // L'authentification est maintenant gérée par les cookies httpOnly côté backend
  // Plus besoin de gérer les tokens manuellement
  
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;

      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.code;
        } catch {
        }
      }

      if (response.status === 401 && globalThis.window !== undefined) {
        this.clearAuthToken();
        const currentLocale = globalThis.window.location.pathname.split('/')[1] || 'fr';
        globalThis.window.location.href = `/${currentLocale}/auth/login`;
      }

      throw new HttpClientError(errorMessage, response.status, errorCode);
    }

    if (isJson) {
      const data = await response.json();
      return {
        data,
        status: response.status,
        message: data.message
      };
    }

    return {
      data: await response.text() as unknown as T,
      status: response.status
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async post<T, U = unknown>(
    endpoint: string, 
    data?: U
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async put<T, U = unknown>(
    endpoint: string, 
    data?: U
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async patch<T, U = unknown>(
    endpoint: string, 
    data?: U
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  // Les tokens sont maintenant gérés via cookies httpOnly côté backend
  // Ces méthodes ne sont plus nécessaires mais gardées pour compatibilité
  setAuthToken(_token: string, _persistent: boolean = false): void {
    // No-op - les cookies sont gérés par le backend
  }

  clearAuthToken(): void {
    // No-op - les cookies sont gérés par le backend
  }
}

export const httpClient = new HttpClient();