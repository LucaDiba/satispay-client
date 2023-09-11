// Create payment
type BaseCreatePaymentRequest = {
  /**
   * Amount of the payment in cents.
   */
  amountUnit: number;

  /**
   * Currency of the payment (only EUR currently supported).
   */
  currency: "EUR";

  /**
   * Order ID or payment external identifier (max length allowed is 50 chars).
   */
  externalCode?: string;

  /**
   * The url that will be called with an HTTP GET request when the payment changes state. When the url is called, "get payment details" can be called to know the new payment status. Note that `{uuid}` will be replaced with the payment ID.
   *
   * @example "https://example.com/my_callback_url?payment_id={uuid}"
   */
  callbackUrl?: string;

  /**
   * The url to redirect the user after the payment flow is completed (it must be a web link / universal link).
   */
  redirectUrl?: string;

  /**
   * The expiration date of the payment.
   */
  expirationDate?: string;

  /**
   * The payment metadata.
   *
   * This generic field can contain up to 20 key-value items with a maximum length of 45 for the key and of 500 chars for the value.
   * The field `phone_number` can be defined to pre-fill the mobile phone number.
   */
  metadata?: object;
};

export type CreatePaymentRequest =
  | ({
      flow: "MATCH_CODE" | "FUND_LOCK" | "PRE_AUTHORIZED_FUND_LOCK";
    } & BaseCreatePaymentRequest)
  | ({
      flow: "PRE_AUTHORIZED";

      /**
       * Pre-authorized token ID.
       *
       * Required with the `PRE_AUTHORIZED` flow only.
       */
      preAuthorizedPaymentsToken: string;
    } & BaseCreatePaymentRequest)
  | ({
      flow: "MATCH_USER";

      /**
       * Unique ID of the consumer that has to accept the payment. To retrieve the customer ID use the "retrive customer" API.
       *
       * Required with the `MATCH_USER` flow only.
       */
      consumerUid: string;
    } & BaseCreatePaymentRequest)
  | ({
      flow: "REFUND";

      /**
       * Unique ID of the payment to refund.
       *
       * Required with the `REFUND` flow only.
       */
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
  /**
   * The ID of the payment to retrieve.
   */
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
  /**
   * Filter by the payment status `ACCEPTED`, `PENDING` or `CANCELED`.
   *
   * @default "ACCEPTED"
   */
  status?: "ACCEPTED" | "PENDING" | "CANCELED";

  /**
   * A limit on the number of objects to be returned, between 1 and 100.
   */
  limit?: number;

  /**
   * Is the ID that defines your place in the list when you make a payment list request.
   */
  startingAfter?: string;

  /**
   * Is the timestamp (in milliseconds) that defines your place in the list when you make a payment list request
   */
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

// Update payment
export type UpdatePaymentRequest = {
  /**
   * The ID of the payment to update.
   */
  id: string;

  /**
   * The update action to perform.
   */
  action: "ACCEPT" | "CANCEL" | "CANCEL_OR_REFUND";

  /**
   * Amount of the payment in cents when using the `FUND_LOCK` flow.
   */
  amountUnit?: number;
};

export type UpdatePaymentResponse = {
  id: string;
  type: string;
  amount_unit: number;
  currency: string;
  status: "ACCEPTED" | "CANCELED";
  expired: boolean;
  metadata: Record<string, unknown>;
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
