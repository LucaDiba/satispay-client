import axios, { AxiosError } from "axios";
import { Settings } from "luxon";

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
  Settings.defaultZone = "Europe/Rome";
  Settings.now = () => 946684800000; // 2000-01-01T00:00:00.000Z

  describe("should return success true and data when request is successful", () => {
    beforeEach(() => {
      mockedAxios.request.mockResolvedValueOnce({
        data: { data: "data" },
      });
    });

    test("use empty string with empty body", async () => {
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
            'Signature keyId="key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="GJ+xfndhFavwn8cH0isx6msKdTJbTh1DjgXsnvqs7dQhkOyoTKHFte797+zXMNjviPDMl2tjkE4yyA5PrVbSCTlIPre32wEsmdEwyPkLEshpbK5m8E8MhJIFt9GRxiQ9xx/xporYyTK2pu3/WRxCozsPbJvyT9LcylRFuBb2KhU="',
          Date: "Sat, 01 Jan 2000 01:00:00 +0100",
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
            'Signature keyId="key-id", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="W4uDQN+gAHn3ov+bsviiG9Xkqt4IxTUToYH3mxvf0GGuAMLG/uMOLi2OQNqbvgjL0bsdaxV3p1mxAqynvNrxS9/xI/60OoTSRbviqDBMyJ99+xV35gXq3DsiAwQlx84Kq7vGi6nWhcIXC5RfGS0rjpGBrPrcQaOjtiAQkLVkeGk="',
          Date: "Sat, 01 Jan 2000 01:00:00 +0100",
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
