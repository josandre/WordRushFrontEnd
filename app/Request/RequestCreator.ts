import { Platform } from "react-native";
import { isWeb } from "../utils/envDetails";
import WebTokenManager from "../StorageManager/TokenManagers/web/WebTokenManager";
import MobileTokenManager from "../StorageManager/TokenManagers/mobile/MobileTokenManager";

export class RequestCreator {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      (process.env.EXPO_PUBLIC_API_BASE as string) ||
      (Platform.OS === "android"
        ? "http://10.0.2.2:5178" //TODO add this into a env file
        : "http://127.0.0.1:5178");
  }

  private extractErrorMessage = (body: any): string | undefined => {
    if (!body) return undefined;
    if (typeof body === "string") return body;
    if (typeof body === "object") {
      if (typeof body.message === "string") return body.message;
      if (Array.isArray(body.errors)) {
        const first = body.errors[0];
        if (typeof first === "string") return first;
        if (first && typeof first.message === "string") return first.message;
      }

      for (const key of Object.keys(body)) {
        const val = (body as any)[key];
        if (typeof val === "string") return val;
      }
    }
    return undefined;
  };

  private async request<T>(
    path: string,
    options: RequestInit,
  ): Promise<{
    success: boolean;
    data?: T;
    errorMessage?: string;
    status?: number;
    details?: unknown;
  }> {
    const token = isWeb
      ? await WebTokenManager.getAccessToken()
      : await MobileTokenManager.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : (options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        headers,
        ...options,
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body: unknown = isJson
        ? await response.json().catch(() => undefined)
        : await response.text().catch(() => undefined);

      if (!response.ok) {
        const message =
          this.extractErrorMessage(body) ||
          `Request failed (${response.status})`;
        return {
          success: false,
          errorMessage: message,
          status: response.status,
          details: body,
        };
      }

      return { success: true, data: body as T };
    } catch (err: any) {
      return { success: false, errorMessage: err?.message || "Network error" };
    }
  }

  public async post<T>(
    path: string,
    payload: any,
  ): Promise<{ success: boolean; data?: T; errorMessage?: string }> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async put<T>(
    path: string,
    payload: any,
  ): Promise<{ success: boolean; data?: T; errorMessage?: string }> {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  public async get<T>(
    path: string,
  ): Promise<{ success: boolean; data?: T; errorMessage?: string }> {
    return this.request<T>(path, { method: "GET" });
  }
}
