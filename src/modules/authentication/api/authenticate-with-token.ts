import { BASE_URLS } from "../../../const";
import { makeRequest } from "../../../utils";
import {
  AuthenticateWithTokenRequest,
  AuthenticateWithTokenResponse,
} from "../types";

export class AuthenticateWithToken {
  public static do = async (request: AuthenticateWithTokenRequest) => {
    const baseUrl = BASE_URLS[request.environment || "production"];
    const path = "/g_business/v1/authentication_keys";

    const data = {
      public_key: request.publicKey,
      token: request.token,
    };

    const response = await makeRequest<AuthenticateWithTokenResponse>({
      method: "POST",
      url: `${baseUrl}${path}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: data,
    });

    return response;
  };
}
