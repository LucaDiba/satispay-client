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

test("Get payment", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.get({
    id: "test-payment-id",
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "GET",
    url: "https://authservices.satispay.com/g_business/v1/payments/test-payment-id",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="Eex//9eCvDp5VXXrfz3KJjq2fo4rqA86PWdKfhcTN6hJG0S5F/l3X8CwMStzrzzMA7SVTEjrXDpBXoepGDVDB1LMCHD3PosAg/yyjKeun9birFtiB5llbwVP+5MfKM8LTHbsSORA29rys4ZTaAGO6jikdmE4HWI0faJiy0iipek="',
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
