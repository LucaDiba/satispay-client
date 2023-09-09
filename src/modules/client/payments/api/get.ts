import { GetPaymentRequest, GetPaymentResponse } from "../types";
import { Api } from "../../api";

export class GetPayment extends Api {
  public do = (request: GetPaymentRequest) => {
    return this.request<GetPaymentResponse>(
      "GET",
      `/g_business/v1/payments/${request.id}`
    );
  };
}
