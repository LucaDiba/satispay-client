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
  status: "PENDING",
  expired: false,
  metadata: {
    order_id: "my_order_id",
    user: "my_user_id",
    payment_id: "my_payment",
    session_id: "my_session",
    key: "value",
  },
  sender: {
    type: "CONSUMER",
  },
  receiver: {
    id: "9b14338e-428e-4942-ab7a-3291f3792e56",
    type: "SHOP",
  },
  insert_date: "2019-07-07T09:00:22.814Z",
  expire_date: "2019-07-07T09:15:22.807Z",
  external_code: "my_order_id",
  redirect_url:
    "https://online.satispay.com/pay/41da7b74-a9f4-4d25-8428-0e3e460d90c1?redirect_url=https%3A%2F%2FmyServer.com%2FmyRedirectUrl",
};

test("MATCH_CODE", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.create({
    flow: "MATCH_CODE",
    amountUnit: 100,
    currency: "EUR",
    externalCode: "external-code",
    callbackUrl: "https://example.com/callback",
    redirectUrl: "https://example.com/redirect",
    expirationDate: "2021-01-01T00:00:00.000Z",
    metadata: { key: "value" },
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "POST",
    url: "https://authservices.satispay.com/g_business/v1/payments",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="RJP7dDyLLQWjrYIfxIGCsowS0DLQXbJH/u5hzI1nVHkJaoZELuVq7jtQbqYIyc56drVWESkGzZv44q7V4+Z4VIJIR6j3A7Qbn3NrLbteK0u34qEJJiO1PXjCK9agdED4Em1Brax7gHpr4Dpjx6UvfEjFTLdE/sojgWBJQ2qir4o="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=nfLsPM1C9wPV+o5H++tpTTDcUB6wXWnp7IDoYMxA1Bo=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      flow: "MATCH_CODE",
      amount_unit: 100,
      currency: "EUR",
      external_code: "external-code",
      callback_url: "https://example.com/callback",
      redirect_url: "https://example.com/redirect",
      expiration_date: "2021-01-01T00:00:00.000Z",
      metadata: { key: "value" },
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});

test("PRE_AUTHORIZED", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.create({
    flow: "PRE_AUTHORIZED",
    amountUnit: 100,
    currency: "EUR",
    preAuthorizedPaymentsToken: "pre-authorized-payments-token",
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "POST",
    url: "https://authservices.satispay.com/g_business/v1/payments",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="I7ytC6o59pb0x6nSBtjHTNWq3KgQpX8BIDXkq3JoVVT4XCiu0PUV0uJC0UCc4zLUVns21wdFrwZv9vHQEYwy/NH3dv3zelEIBaaCaPjwLdZaD7jQtQVLwbw4wgKTfKaR4aUgJpQJNparfeepZrkxAfLeyCOvZfhXg85s4lBDj60="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=CNJ9SgPzNJafl+B2zsLgco1iBNQrxfTTo604aaE3toA=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      flow: "PRE_AUTHORIZED",
      amount_unit: 100,
      currency: "EUR",
      pre_authorized_payments_token: "pre-authorized-payments-token",
      expiration_date: undefined,
      external_code: undefined,
      metadata: undefined,
      redirect_url: undefined,
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});

test("REFUND", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.create({
    flow: "REFUND",
    amountUnit: 100,
    currency: "EUR",
    parentPaymentUid: "parent-payment-uid",
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "POST",
    url: "https://authservices.satispay.com/g_business/v1/payments",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="QH9W4+ngJpZ+dQxF67p6k1oR39OHXOMXQ0LW5ip/WY3mbiT1U5szTz+VWyHYI9ICvPAEYAa1qzBLTUwCo5hPRe0d0jC/R0PMJWbZl5LCvDLH47deDbjqmjCm8p8oUa3Ox0IJaS5KNSk6FFmqbZ7qnsRdVEymO9jAM8FuGaJKMDo="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=3tRRl+y32uRwkr84Gb/zClQ6gs9xTrWGQFH3dcbZBJU=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      flow: "REFUND",
      amount_unit: 100,
      currency: "EUR",
      parent_payment_uid: "parent-payment-uid",
      callback_url: undefined,
      expiration_date: undefined,
      external_code: undefined,
      metadata: undefined,
      redirect_url: undefined,
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});

test("MATCH_USER", async () => {
  axiosMock.request.mockResolvedValueOnce({
    data: expectedReturnData,
  });

  const response = await satispay.payments.create({
    flow: "MATCH_USER",
    amountUnit: 100,
    currency: "EUR",
    consumerUid: "consumer-uid",
  });

  expect(axiosMock.request).toHaveBeenCalledTimes(1);
  expect(axiosMock.request).toHaveBeenCalledWith({
    method: "POST",
    url: "https://authservices.satispay.com/g_business/v1/payments",
    headers: {
      Authorization:
        'Signature keyId="test-key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="a6fSHb1rzWTdsD3XjlGkLpavpzyQNEBDE5flLRP29k96k9YGCJ7/DVfk9FiC+WjCqPqPjQ0+vi7kqMlAr9YuaH5b4B96pe6LHsKI/sB6Ouh1BM2W0x0yOr6YeGMfb+L1EYMT/rG2BhFGdOcp2RU7uC8lm+D6dq1yCNJ7fjOZdLs="',
      Date: "Sat, 01 Jan 2000 01:00:00 +0100",
      Digest: "SHA-256=O6nTKD7iZvYpHZkheE6wZiuKC1D2Jaq0h0RirEEl3CM=",
      Host: "authservices.satispay.com",
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      flow: "MATCH_USER",
      amount_unit: 100,
      currency: "EUR",
      consumer_uid: "consumer-uid",
      callback_url: undefined,
      expiration_date: undefined,
      external_code: undefined,
      metadata: undefined,
      redirect_url: undefined,
    },
  });

  expect(response).toEqual({
    success: true,
    data: expectedReturnData,
  });
});
