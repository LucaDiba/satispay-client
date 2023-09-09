// Authenticate with token
export type AuthenticateWithTokenRequest = {
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

export type AuthenticateWithTokenResponse = {
  /**
   * The key ID that can be used to authenticate with the API.
   */
  key_id: string;
};
