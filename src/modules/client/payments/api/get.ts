import { Api } from "../../api";
import { GetPaymentRequest, GetPaymentResponse } from "../types";

export class GetPayment extends Api {
  public do = (request: GetPaymentRequest) => {
    return this.request<GetPaymentResponse>(
      "GET",
      `/g_business/v1/payments/${request.id}`
    );
  };
}
