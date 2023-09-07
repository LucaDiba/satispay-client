import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetAllPaymentsRequest,
  GetAllPaymentsResponse,
  GetPaymentRequest,
} from "./types/payments";
import { makeAuthorizedRequest, makeRequest } from "./utils";
import crypto from "crypto";

const BASE_URLS = {
  production: "https://authservices.satispay.com",
  sandbox: "https://staging.authservices.satispay.com",
} as const;

type SatispayClientOptions = {
  keyId: string;
  privateKey: string;

  /**
   * The environment to use for the API calls.
   *
   * @default "production"
   */
  environment?: "production" | "sandbox";
};

export default class SatispayClient {
  private keyId: string;

  private privateKey: string;

  private baseUrl: string;

  constructor(options: SatispayClientOptions) {
    this.keyId = options.keyId;
    this.privateKey = options.privateKey;
    this.baseUrl = BASE_URLS[options.environment || "production"];
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
    getAll: (request: GetAllPaymentsRequest = {}) => {
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
  ) {
    return makeAuthorizedRequest<T>({
      baseUrl: this.baseUrl,
      keyId: this.keyId,
      privateKey: this.privateKey,
      method,
      path,
      body,
      headers,
    });
  }
}

type SatispayAuthenticationAuthenticateWithTokenOptions = {
  token: string;

  /**
   * The RSA publicKey key to use for the API calls.
   */
  publicKey: string;

  /**
   * The environment to use for the API calls.
   *
   * @default "production"
   */
  environment?: "production" | "sandbox";
};

export class SatispayAuthentication {
  public static async authenticateWithToken({
    token,
    publicKey,
    environment,
  }: SatispayAuthenticationAuthenticateWithTokenOptions) {
    const baseUrl = BASE_URLS[environment || "production"];
    const path = "/g_business/v1/authentication_keys";

    const response = await makeRequest<{
      key_id: string;
    }>({
      method: "POST",
      url: `${baseUrl}${path}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: { public_key: publicKey, token },
    });

    return response;
  }

  public static async generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    return {
      publicKey,
      privateKey,
    };
  }
}
