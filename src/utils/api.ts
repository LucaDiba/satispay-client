import axios, { type AxiosError } from "axios";
import crypto from "crypto";
import { DateTime } from "luxon";

import SatispayError from "../errors/SatispayError";

function getAuthHeaders({
  keyId,
  privateKey,
  body,
  httpVerb,
  httpBaseUrl,
  httpEndpoint,
}: {
  keyId: string;
  privateKey: string;
  body: string;
  httpVerb: "GET" | "POST" | "PUT" | "DELETE";
  httpBaseUrl: string;
  httpEndpoint: string;
}) {
  const digest = `SHA-256=`.concat(
    crypto.createHash("sha256").update(body).digest("base64")
  );

  const headers = {
    "(request-target)": `${httpVerb.toLowerCase()} ${httpEndpoint}`,
    host: httpBaseUrl.replace("https://", ""),
    date: DateTime.now().toFormat("EEE, dd MMM yyyy HH:mm:ss ZZZ"),
    digest,
  };

  const string =
    `(request-target): ${headers["(request-target)"]}\n` +
    `host: ${headers.host}\n` +
    `date: ${headers.date}\n` +
    `digest: ${headers.digest}`;

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(string)
    .sign(privateKey, "base64");

  const authorizationHeader = `Signature keyId="${keyId}", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="${signature}"`;

  return {
    Host: headers.host,
    Date: headers.date,
    Digest: headers.digest,
    Authorization: authorizationHeader,
  };
}

export async function makeRequest<T>({
  method,
  url,
  body,
  headers,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
}): Promise<T> {
  try {
    const response = await axios.request<T>({
      method,
      url,
      headers,
      data: body,
    });

    return response.data;
  } catch (err: AxiosError | unknown) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;

      throw new SatispayError({
        message: axiosError.message,
        data: axiosError.response?.data,
        code: axiosError.code || "UNKNOWN",
        status: axiosError.status || 500,
      });
    }

    throw err;
  }
}

export async function makeAuthorizedRequest<T>({
  baseUrl,
  keyId,
  privateKey,
  method,
  path,
  body,
  headers,
}: {
  baseUrl: string;
  keyId: string;
  privateKey: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}) {
  const url = `${baseUrl}${path}`;
  const authHeaders = getAuthHeaders({
    keyId: keyId,
    privateKey: privateKey,
    body: body ? JSON.stringify(body) : "",
    httpVerb: method,
    httpBaseUrl: baseUrl,
    httpEndpoint: path,
  });

  const requestHeaders = {
    ...headers,
    ...authHeaders,
    accept: "application/json",
    "content-type": "application/json",
  };

  return makeRequest<T>({
    method,
    url,
    body,
    headers: requestHeaders,
  });
}
