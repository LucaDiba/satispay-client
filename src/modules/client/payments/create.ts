import { CreatePaymentRequest, CreatePaymentResponse } from "./types";
import { Api } from "../api";

export class CreatePayment extends Api {
  public do = (request: CreatePaymentRequest) => {
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
  };
}
