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
  has_more: true,
  data: [
    {
      id: "41da7b74-a9f4-4d25-8428-0e3e460d90c1",
      type: "TO_BUSINESS",
      amount_unit: 100,
      currency: "EUR",
      status: "ACCEPTED",
      status_ownership: false,
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
      status_owner: {
        id: "9f4cf614-4860-4be0-ae25-d07950b86f70",
        type: "DEVICE",
      },
      daily_closure: {
        id: "20180801",
        date: "2018-08-01T00:00:00.000Z",
      },
      insert_date: "2019-07-07T09:00:22.814Z",
      expire_date: "2019-07-07T09:15:22.807Z",
      external_code: "my_order_id",
    },
  ],
};

test("Without parameters", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.getAll();

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "GET",
    url: "https://authservices.satispay.com/g_business/v1/payments?",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="ChnInWAbFlnC+8y+ddM91ETNpAPqUImpiv2tMt1KRakGJYC/bO3o4YVmHRkjnOGJIjqD/lEEV2S7SoGmqwsTWc8UmoCr4PjtAKquyXimkRE3s7r7mY432ry19aJqif6EIdXL3ZG0hpQY5BEtXXvrBlRkQFxg3iqSYA0sFb/4ZFA="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});

test("With parameters", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.getAll({
    status: "CANCELED",
    limit: 42,
    startingAfter: "my_starting_after",
    startingAfterTimestamp: "my_starting_after_timestamp",
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "GET",
    url: "https://authservices.satispay.com/g_business/v1/payments?status=CANCELED&limit=42&starting_after=my_starting_after&starting_after_timestamp=my_starting_after_timestamp",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="a1hHLrv22EGRLD7iRbBJaUYUH8AZVU6JmM5h4Tv6wjCZE7H6nX/fryEn6oyRJzoh0FtZRks436JxtXq7efngEk+4f+tLdMItebmrTa5DUnfjG2RP9FXfXQy+myK3hbk8mk4MbyvRevbYMtaNEk32knPJvLDQ5Z/lLNPbqAdXmMc="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});
