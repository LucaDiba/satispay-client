import { UpdatePaymentRequest, UpdatePaymentResponse } from "./types";
import { Api } from "../api";

export class UpdatePayment extends Api {
  public do = (request: UpdatePaymentRequest) => {
    const data = {
      action: request.action,
    } as Record<string, unknown>;

    if (request.amountUnit) {
      data.amount_unit = request.amountUnit;
    }

    return this.request<UpdatePaymentResponse>(
      "PUT",
      `/g_business/v1/payments/${request.id}`,
      data
    );
  };
}
