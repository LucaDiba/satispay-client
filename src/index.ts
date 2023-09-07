import crypto from "crypto";
import axios, { type AxiosError } from "axios";
import { DateTime } from "luxon";
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetAllPaymentsRequest,
  GetAllPaymentsResponse,
  GetPaymentRequest,
} from "./types/payments";

const BASE_URLS = {
  production: "https://authservices.satispay.com",
  sandbox: "https://staging.authservices.satispay.com",
} as const;

type SatispayClientOptions = {
  keyId: string;
  privateKey: string;
  baseUrl?: "production" | "sandbox";
};

class SatispayClient {
  private keyId: string;

  private privateKey: string;

  private baseUrl: string;

  constructor(options: SatispayClientOptions) {
    this.keyId = options.keyId;
    this.privateKey = options.privateKey;
    this.baseUrl = BASE_URLS[options.baseUrl || "production"];
  }

  public payments = {
    create: (request: CreatePaymentRequest) => {
      const data = {
        flow: request.flow,
        amount_unit: request.amountUnit,
        currency: request.currency,
        external_code: request.externalCode,
        callback_url: request.callbackUrl,
        redirect_url: request.redirectUrl,
        expiration_date: request.expirationDate,
      } as Record<string, unknown>;

      if (request.flow === "PRE_AUTHORIZED") {
        data.pre_authorized_payments_token = request.preAuthorizedPaymentsToken;
      }

      if (request.flow === "REFUND") {
        data.parent_payment_uid = request.parentPaymentUid;
      }

      if (request.flow === "MATCH_USER") {
        data.consumer_uid = request.consumerUid;
      }

      return this.request<CreatePaymentResponse>(
        "POST",
        "/g_business/v1/payments",
        data
      );
    },

    get: (request: GetPaymentRequest) => {
      return this.request<CreatePaymentResponse>(
        "GET",
        `/g_business/v1/payments/${request.id}`
      );
    },

    /**
     * 
     * Payments returned by this API are paginated with a default limit of 20 items. The has_more boolean field tells you if there are more payments than the limit used and you should use the startingAfter parameters filled with the id of the last payment if you want to retrieve the next page of the list.

     *  If you want to list all Payments for specific date you should:
     *  1. call getAll() using the parameter startingAfterTimestamp and using the timestamp in milliseconds of the date you want,
     *  2. save the last payment id returned at step 1,
     *  3. call getAll() using the parameter startingAfter and using the payment id you saved at the step 2,
     *  4. save the last payment id returned at step 3,
     *  5. repeat step 4 until you reach the last payment of the date you need.
     */
    getAll: (request: GetAllPaymentsRequest) => {
      const params = [] as Array<[string, string]>;

      if (request.status) {
        params.push(["status", request.status]);
      }

      if (request.limit) {
        params.push(["limit", request.limit.toString()]);
      }

      if (request.startingAfter) {
        params.push(["starting_after", request.startingAfter]);
      }

      if (request.startingAfterTimestamp) {
        params.push([
          "starting_after_timestamp",
          request.startingAfterTimestamp,
        ]);
      }

      const queryParams = new URLSearchParams(params);
      const path = `/g_business/v1/payments?${queryParams.toString()}`;

      return this.request<GetAllPaymentsResponse>("GET", path);
    },
  };

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<
    | {
        success: true;
        data: T;
      }
    | {
        success: false;
        error: unknown;
      }
  > {
    const url = `${this.baseUrl}${path}`;

    try {
      const authHeaders = this.getAuthHeaders({
        body: body ? JSON.stringify(body) : "",
        httpVerb: method,
        httpBaseUrl: this.baseUrl,
        httpEndpoint: path,
      });

      const requestHeaders = {
        ...headers,
        ...authHeaders,
        accept: "application/json",
        "content-type": "application/json",
      };

      const response = await axios.request<T>({
        method,
        url,
        headers: requestHeaders,
        data: body,
      });

      return {
        success: true,
        data: response.data as T,
      };
    } catch (err: AxiosError | unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          error: (err as AxiosError).response?.data,
        };
      }

      return {
        success: false,
        error: err,
      };
    }
  }

  private getAuthHeaders({
    body,
    httpVerb,
    httpBaseUrl,
    httpEndpoint,
  }: {
    body: string;
    httpVerb: "GET" | "POST" | "PUT" | "DELETE";
    httpBaseUrl: string;
    httpEndpoint: string;
  }) {
    const keyId = this.keyId;
    const privateKey = this.privateKey;

    const digest = `SHA-256=`.concat(
      crypto.createHash("sha256").update(body).digest("base64")
    );

    const headers = {
      "(request-target)": `${httpVerb.toLowerCase()} ${httpEndpoint}`,
      host: httpBaseUrl,
      date: DateTime.now().toFormat("EEE, dd MMM yyyy HH:mm:ss O"),
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
}

export default SatispayClient;
