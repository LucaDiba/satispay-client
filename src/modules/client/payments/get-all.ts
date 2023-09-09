import { GetAllPaymentsRequest, GetAllPaymentsResponse } from "./types";
import { Api } from "../api";

export class GetAllPayments extends Api {
  public do = (request: GetAllPaymentsRequest) => {
    const params = [] as Array<[string, string]>;

    if (request.status) {
      params.push(["status", request.status]);
    }

    if (request.limit) {
      params.push(["limit", request.limit.toString()]);
    }

    if (request.startingAfter) {
      params.push(["starting_after", request.startingAfter]);
    }

    if (request.startingAfterTimestamp) {
      params.push(["starting_after_timestamp", request.startingAfterTimestamp]);
    }

    const queryParams = new URLSearchParams(params);
    const path = `/g_business/v1/payments?${queryParams.toString()}`;

    return this.request<GetAllPaymentsResponse>("GET", path);
  };
}
