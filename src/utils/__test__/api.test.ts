import axios, { AxiosError } from "axios";
import { DateTime } from "luxon";

import { makeAuthorizedRequest, makeRequest } from "../api";
import { TEST_PRIVATE_KEY } from "../test-utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("makeRequest", () => {
  test("should return success true and data when request is successful", async () => {
    mockedAxios.request.mockResolvedValueOnce({
      data: { data: "data" },
    });

    const response = await makeRequest({
      method: "GET",
      url: "https://example.com/test",
    });

    expect(mockedAxios.request).toHaveBeenCalledTimes(1);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: "GET",
      url: "https://example.com/test",
      headers: undefined,
      data: undefined,
    });

    expect(response).toEqual({
      success: true,
      data: { data: "data" },
    });
  });

  test("should return success false and error when request is unsuccessful", async () => {
    mockedAxios.request.mockRejectedValueOnce(
      new AxiosError("Unauthorized", "401", undefined, undefined, {
        data: { errors: [{ detail: "detail-text" }] },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        // @ts-expect-error mock
        config: {},
      })
    );

    const response = await makeRequest({
      method: "GET",
      url: "https://example.com/test",
    });

    expect(mockedAxios.request).toHaveBeenCalledTimes(1);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: "GET",
      url: "https://example.com/test",
      headers: undefined,
      data: undefined,
    });

    expect(response).toEqual(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

describe("makeAuthorizedRequest", () => {
  DateTime.now = jest.fn(() => DateTime.fromISO("2000-01-01T00:00:00.000Z"));

  describe("should return success true and data when request is successful", () => {
    test("use empty string with empty body", async () => {
      mockedAxios.request.mockResolvedValueOnce({
        data: { data: "data" },
      });

      const response = await makeAuthorizedRequest({
        baseUrl: "https://example.com",
        method: "GET",
        path: "/test",
        privateKey: TEST_PRIVATE_KEY,
        keyId: "key-id",
      });

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: "GET",
        url: "https://example.com/test",
        headers: {
          Authorization:
            'Signature keyId="key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="Cnmmi17UAz/acUZYk1+lpLGuAjXuNg5sCMEWFwiPdeB+oACX+sI5cgtzzPn7kZWH2egVZQfwcRYjSmFsVBayYVrrb2exasC2wk4wri8Gr/tCuNSSBn0eGVRe/r8bzf43OSkjBa9zF6IkJX/IIkV6YzC1ew7/oXII11wdTZKFM3k="',
          Date: "Fri, 31 Dec 1999 17:00:00 O",
          Digest: "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
          Host: "example.com",
          accept: "application/json",
          "content-type": "application/json",
        },
        data: undefined,
      });

      expect(response).toEqual({
        success: true,
        data: { data: "data" },
      });
    });

    test("use body with body", async () => {
      mockedAxios.request.mockResolvedValueOnce({
        data: { data: "data" },
      });

      const response = await makeAuthorizedRequest({
        baseUrl: "https://example.com",
        method: "GET",
        path: "/test",
        privateKey: TEST_PRIVATE_KEY,
        keyId: "key-id",
        body: {
          testData: "test-data",
          testNumber: 1,
          testBoolean: true,
          testNull: null,
          testObject: { test: "test" },
          testArray: ["test"],
        },
      });

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: "GET",
        url: "https://example.com/test",
        headers: {
          Authorization:
            'Signature keyId="key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="AK1q6Xzl23H38QPJqxFZDfMhIn6S8kcJRJxH6L14f5iLC+hUUV3YaVm0JXWFXpyRZQJoKrlEFdZ3TkOS4L0TLiGnnO2+WByoLFEGf4+4nL4GHd3jMQsG9TXS5xGhzOaPXW5aheXg2RN3hOmV9I1Fqq/n6RG8uFweFdqjQgLsaXU="',
          Date: "Fri, 31 Dec 1999 17:00:00 O",
          Digest: "SHA-256=8Hrlh20i4QPRchAJacdik6BzVe6aTRAeGL3BQuFPNwM=",
          Host: "example.com",
          accept: "application/json",
          "content-type": "application/json",
        },
        data: {
          testData: "test-data",
          testNumber: 1,
          testBoolean: true,
          testNull: null,
          testObject: { test: "test" },
          testArray: ["test"],
        },
      });

      expect(response).toEqual({
        success: true,
        data: { data: "data" },
      });
    });
  });
});
