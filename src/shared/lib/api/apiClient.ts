"use client";

import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { parseJsonResponse } from "@/shared/utils/api/apiUtils";

export class ApiClient {
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const response: Response = await fetch(endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
      });

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      return await parseJsonResponse<T>(response);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new CustomError(ErrorCode.TIMEOUT_ERROR, 408);
        }

        if (error.message.includes("fetch")) {
          throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
        }
      }

      throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, 500);
    }
  }

  // 편의 메서드 (GET, POST, PUT, PATCH, DELETE)
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();