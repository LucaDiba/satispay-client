import { BASE_URLS } from "../../const";
import { makeAuthorizedRequest } from "../../utils/api";
import { ClientOptions } from ".";

export class Api {
  protected options: ClientOptions;

  protected baseUrl: string;

  constructor(options: ClientOptions) {
    this.options = options;
    this.baseUrl = BASE_URLS[options.environment || "production"];
  }

  protected async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) {
    return makeAuthorizedRequest<T>({
      baseUrl: this.baseUrl,
      keyId: this.options.keyId,
      privateKey: this.options.privateKey,
      method,
      path,
      body,
      headers,
    });
  }
}
