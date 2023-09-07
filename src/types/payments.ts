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

// Get payment
export type GetPaymentRequest = {
  id: string;
};

export type GetPaymentResponse = {
  id: string;
  code_identifier: string;
  type: "TO_BUSINESS" | "REFUND_TO_BUSINESS";
  amount_unit: number;
  currency: string;
  status: "PENDING" | "ACCEPTED" | "CANCELED" | "AUTHORIZED";
  expired: boolean;
  metadata: object;
  sender: {
    id: string;
    type: "CONSUMER";
    name: string;
  };
  receiver: {
    id: string;
    type: "SHOP";
  };
  daily_closure: {
    id: string;
    date: string;
  };
  insert_date: string;
  expire_date: string;
  external_code: string;
};

// Get all payments
export type GetAllPaymentsRequest = {
  status?: "ACCEPTED" | "PENDING" | "CANCELED";
  limit?: number; // A number between 1 and 100
  startingAfter?: string;
  startingAfterTimestamp?: string;
};

export type GetAllPaymentsResponse = {
  has_more: boolean;
  data: Array<{
    id: string;
    type: "TO_BUSINESS" | "REFUND_TO_BUSINESS";
    amount_unit: number;
    currency: string;
    status: "PENDING" | "ACCEPTED" | "CANCELED" | "AUTHORIZED";
    status_ownership: boolean;
    expired: boolean;
    metadata: object;
    sender: {
      id: string;
      type: "CONSUMER";
      name: string;
    };
    receiver: {
      id: string;
      type: "SHOP";
    };
    status_owner: {
      id: string;
      type: "DEVICE";
    };
    daily_closure: {
      id: string;
      date: string;
    };
    insert_date: string;
    expire_date: string;
    external_code: string;
  }>;
};
