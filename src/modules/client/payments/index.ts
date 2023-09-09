import {
  CreatePaymentRequest,
  GetAllPaymentsRequest,
  GetPaymentRequest,
  UpdatePaymentRequest,
} from "./types";
import { Api } from "../api";
import { GetPayment } from "./api/get";
import { GetAllPayments } from "./api/get-all";
import { UpdatePayment } from "./api/update";
import { CreatePayment } from "./api/create";

export class Payments extends Api {
  /**
   * Create a new payment.
   *
   * When creating a payment you can use one of this flows:
   * - `MATCH_CODE`: to create a payment that has to be paid scanning a Dynamic Code;
   * - `MATCH_USER`: to create a payment request for a specific consumer;
   * - `REFUND`: to partially/completely refund a Payment that is ACCEPTED;
   * - `PRE_AUTHORIZED`: to create a payment with a pre-authorized token;
   * - `FUND_LOCK`: to create a payment that locks funds on consumer's wallet;
   * - `PRE_AUTHORIZED_FUND_LOCK`: to create a pre-authorized payment that locks funds on consumer's wallet.
   */
  public create = (request: CreatePaymentRequest) => {
    return new CreatePayment(this.options).do(request);
  };

  /**
   * Get a payment by ID.
   */
  public get = (request: GetPaymentRequest) => {
    return new GetPayment(this.options).do(request);
  };

  /**
   * Payments returned by this API are paginated with a default limit of 20 items. The has_more boolean field tells you if there are more payments than the limit used and you should use the startingAfter parameters filled with the id of the last payment if you want to retrieve the next page of the list.

    * If you want to list all Payments for specific date you should:
    * 1. call getAll() using the parameter startingAfterTimestamp and using the timestamp in milliseconds of the date you want,
    * 2. save the last payment id returned at step 1,
    * 3. call getAll() using the parameter startingAfter and using the payment id you saved at the step 2,
    * 4. save the last payment id returned at step 3,
    * 5. repeat step 4 until you reach the last payment of the date you need.
    */
  public getAll = (request: GetAllPaymentsRequest = {}) => {
    return new GetAllPayments(this.options).do(request);
  };

  /**
   * Update a payment by ID.
   *
   * When updating a payment there are different actions that can be executed:
   * - `ACCEPT`: to confirm a pending payment created by the users;
   * - `CANCEL`: to cancel a pending payment;
   * - `CANCEL_OR_REFUND`: to request a payment to be either canceled if still pending or refunded if already accepted.
   *
   * **`REFUND` vs `CANCEL` payments**
   *
   * A payment can be updated to `CANCELED` only if it hasn't been `ACCEPTED` yet.
   * If an `ACCEPTED` payment needs to be refunded you need to create a payment with a `REFUND` flow.
   *
   * **Retry logic**
   *
   * If the API returns any of the possible error, like a 500, this doesn't mean that the payment might not be `ACCEPTED` already.
   *
   * If you get the error we suggest to execute a retry within few seconds and if still not getting a response execute an "update payment" with the `CANCEL_OR_REFUND` flow.
   *
   * **`CANCEL_OR_REFUND`**
   *
   * We strongly suggest to execute an "update payment" with action `CANCEL_OR_REFUND` whenever you are not able to get the status of a payment.
   *
   * This might be caused by either Satispay being temporarily unavailable or network issues.
   *
   * Executing a `CANCEL_OR_REFUND` we avoid the case of a user who confirms a payment, the payment is accepted but you do not issue the product to the user.
   */
  public update = (request: UpdatePaymentRequest) => {
    return new UpdatePayment(this.options).do(request);
  };
}
