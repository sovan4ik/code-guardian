import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export class HttpClient {
  protected readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const res = await this.client.request<T>(config);
      return res.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const data = error.response?.data as any;
      const message =
        data?.message ||
        data?.error ||
        error.response?.statusText ||
        error.message;

      return new Error(message);
    }

    return error instanceof Error ? error : new Error("Unknown error");
  }
}
