import axios, { AxiosError, AxiosInstance } from "axios";

export type GraphqlErrorItem = {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
};

export type GraphqlResponse<T> = {
  data?: T;
  errors?: GraphqlErrorItem[];
};

export class GraphqlClient {
  protected readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async request<
    TData,
    TVariables extends Record<string, any> = Record<string, any>,
  >(params: {
    query: string;
    variables?: TVariables;
    operationName?: string;
  }): Promise<TData> {
    try {
      const res = await this.client.post<GraphqlResponse<TData>>("/graphql", {
        query: params.query,
        variables: params.variables,
        operationName: params.operationName,
      });

      if (res.data?.errors?.length) {
        const msg = res.data.errors.map((e) => e.message).join("; ");
        throw new Error(msg);
      }

      if (!res.data?.data) {
        throw new Error("GraphQL: empty data");
      }

      return res.data.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const data = error.response?.data as any;

      const gqlErrors = data?.errors;
      if (Array.isArray(gqlErrors) && gqlErrors.length) {
        return new Error(gqlErrors.map((e: any) => e?.message).join("; "));
      }

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
