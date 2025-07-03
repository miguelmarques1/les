import axios from 'axios';

type AxiosInstance = ReturnType<typeof axios.create>;
type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
};

interface ApiResponse<T> {
  data: T;
  error: boolean;
  message: string | null;
}

interface RequestParams {
  [key: string]: any;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(url: string, params?: RequestParams): Promise<T> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, { params });
      console.log(response);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (response.data.error) {
      throw new Error(response.data.message || 'API returned an error');
    }
    return response.data.data;
  }

  private handleError(error: any): never {
    if (error.response != undefined) {
      if (error.response) {
        throw new Error(error.response.data.message || `API request failed with status ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No response received from the API');
      }
    }
    throw new Error(error.message || 'API request failed');
  }
}