import axios from "axios";
import { Settings } from "luxon";

import { TEST_KEY_ID, TEST_PRIVATE_KEY } from "../../../../../utils/test-utils";
import { Client } from "../../..";

jest.mock("axios");

let axiosMock: jest.Mocked<typeof axios>;
let satispay: Client;

beforeEach(() => {
  Settings.defaultZone = "Europe/Rome";
  Settings.now = () => 946684800000; // 2000-01-01T00:00:00.000Z

  axiosMock = axios as jest.Mocked<typeof axios>;
  axiosMock.request.mockClear();

  satispay = new Client({
    keyId: TEST_KEY_ID,
    privateKey: TEST_PRIVATE_KEY,
  });
});

const expectedReturnData = {
  id: "41da7b74-a9f4-4d25-8428-0e3e460d90c1",
  code_identifier: "S6Y-PAY--41DA7B74-A9F4-4D25-8428-0E3E460D90C1",
  type: "TO_BUSINESS",
  amount_unit: 100,
  currency: "EUR",
  status: "ACCEPTED",
  expired: false,
  metadata: {
    order_id: "my_order_id",
    user: "my_user_id",
    payment_id: "my_payment",
    session_id: "my_session",
    key: "value",
  },
  sender: {
    id: "efe81246-eb8a-11e5-95cc-06cb0bb44fdf",
    type: "CONSUMER",
    name: "Massimo S.",
  },
  receiver: {
    id: "9b14338e-428e-4942-ab7a-3291f3792e56",
    type: "SHOP",
  },
  daily_closure: {
    id: "20190707",
    date: "2019-07-07T00:00:00.000Z",
  },
  insert_date: "2019-07-07T09:00:22.814Z",
  expire_date: "2019-07-07T09:15:22.807Z",
  external_code: "my_order_id",
};

test("Without amount unit", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.update({
    id: "test-payment-id",
    action: "ACCEPT",
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "PUT",
    url: "https://authservices.satispay.com/g_business/v1/payments/test-payment-id",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="Z7YG4PeI2sKwgYfQyRBomcWdRsryJIfN/vNwbtQRUq5WekXsg9brO6IXFHdy15Jvrtl2jPzDyHQOj1/4i61TF8TqRychwDf8saAdGmTuPhcORrfVqHHRLtN+In+6jzgEZd9gok8xuJZ5zYH6TMKwSKXXcb8eIobZNvr90iwKoD0="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=ApxXPThwY0BF7nd6MO1Xe0Mn5fhINYacX8hX6N33OXY=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      action: "ACCEPT",
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});

test("With amount unit", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.update({
    id: "test-payment-id",
    action: "ACCEPT",
    amountUnit: 100,
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "PUT",
    url: "https://authservices.satispay.com/g_business/v1/payments/test-payment-id",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="Trp9YWFTNSIYhPHkkGI2JE1EsJ+HxL2eLKYWpNjkA921TU7w+HCWCci8kzsCvAYwq8bu2aDob+VXHIB0Jf6uSejbgnArvprX2kKKsM56IgZFzlFfROhIHeAiUwGSitigg92aDyLcBYSaGVhmb4ozrsc6gPPqoHhPpPyQxBl7c1U="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=L8MnytPzmp5Z4qk7AHUerZhkJfrvEg6ilRNIr9Y9LA0=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      action: "ACCEPT",
      amount_unit: 100,
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});
