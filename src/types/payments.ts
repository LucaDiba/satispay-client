// Create payment
type BaseCreatePaymentRequest = {
  amountUnit: number;
  currency: "EUR";
  externalCode?: string; // max 50 chars
  callbackUrl?: string;
  redirectUrl?: string;
  expirationDate?: string; // ISO 8601
};

export type CreatePaymentRequest =
  | ({
      flow: "MATCH_CODE" | "FUND_LOCK" | "PRE_AUTHORIZED_FUND_LOCK";
    } & BaseCreatePaymentRequest)
  | ({
      flow: "PRE_AUTHORIZED";
      preAuthorizedPaymentsToken: string;
    } & BaseCreatePaymentRequest)
  | ({
      flow: "MATCH_USER";
      consumerUid: string;
    } & BaseCreatePaymentRequest)
  | ({
      flow: "REFUND";
      parentPaymentUid: string;
    } & BaseCreatePaymentRequest);

export type CreatePaymentResponse = {
  id: string;
  code_identifier: string;
  type: "TO_BUSINESS" | "REFUND_TO_BUSINESS";
  amount_unit: number;
  currency: string;
  status: "PENDING" | "ACCEPTED" | "AUTHORIZED";
  expired: boolean;
  metadata: object;
  sender: {
    id: string;
    type: "CONSUMER" | "SHOP";
    name: string;
  };
  receiver: {
    id: string;
    type: "SHOP" | "CONSUMER";
  };
  insert_date: string;
  expire_date: string;
  external_code: string;
  redirect_url: string;
};
