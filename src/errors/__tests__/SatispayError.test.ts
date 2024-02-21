import SatispayError from "../SatispayError";

test("SatispayError", () => {
  const error = new SatispayError({
    message: "test-message",
    data: { test: "data" },
    code: "test-code",
    status: 400,
  });

  expect(error.name).toBe("SatispayError");
  expect(error.message).toBe("test-message");
  expect(error.data).toEqual({ test: "data" });
  expect(error.code).toBe("test-code");
  expect(error.status).toBe(400);
});

describe("isSatispayError", () => {
  test("SatispayError", () => {
    const error = new SatispayError({
      message: "test-message",
      data: { test: "data" },
      code: "test-code",
      status: 400,
    });

    expect(SatispayError.isSatispayError(error)).toBe(true);
  });

  test("Error", () => {
    const error = new Error("test-message");

    expect(SatispayError.isSatispayError(error)).toBe(false);
  });
});
