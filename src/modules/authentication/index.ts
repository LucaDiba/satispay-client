import { AuthenticateWithToken } from "./api/authenticate-with-token";
import { GenerateKeyPair } from "./api/generate-key-pair";
import { AuthenticateWithTokenRequest } from "./types";

export class Authentication {
  /**
   * Returns the key ID that can be used to authenticate with the API.
   *
   * The token is the activation code generated from Satispay Dashboard (or provided manually for sandbox accounts). Tokens are disposable, so the key ID must be saved after its creation.
   */
  public static async authenticateWithToken(
    request: AuthenticateWithTokenRequest
  ) {
    return AuthenticateWithToken.do(request);
  }

  /**
   * Generates a RSA key pair. The public key can be used with the token to get the key ID. Then, the key ID and the private key can be used to authenticate with the API.
   */
  public static async generateKeyPair() {
    return GenerateKeyPair.do();
  }
}
