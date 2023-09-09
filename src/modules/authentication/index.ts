import crypto from "crypto";
import { BASE_URLS } from "../../const";
import { makeRequest } from "../../utils";

type SatispayAuthenticationAuthenticateWithTokenOptions = {
  /**
   * The single-use activation code that can be generated from the Satispay Dashboard.
   */
  token: string;

  /**
   * The RSA public key. This can be generated with the `generateKeyPair` method.
   */
  publicKey: string;

  /**
   * The environment to use for the API calls.
   *
   * @default "production"
   */
  environment?: "production" | "sandbox";
};

export class Authentication {
  /**
   * Returns the key ID that can be used to authenticate with the API.
   *
   * The token is the activation code generated from Satispay Dashboard (or provided manually for sandbox accounts). Tokens are disposable, so the key ID must be saved after its creation.
   */
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

  /**
   * Generates a RSA key pair. The public key can be used with the token to get the key ID. Then, the key ID and the private key can be used to authenticate with the API.
   */
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
