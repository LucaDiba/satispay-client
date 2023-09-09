import {
  CreatePaymentRequest,
  GetAllPaymentsRequest,
  GetPaymentRequest,
} from "./types";
import { Api } from "../api";
import { CreatePayment } from "./create";
import { GetPayment } from "./get";
import { GetAllPayments } from "./get-all";

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
}
