export default class SatispayError extends Error {
  public name = "SatispayError";

  public data: unknown;

  public code: string;

  public status: number;

  public constructor({
    message,
    data,
    code,
    status,
  }: {
    message: string;
    data: unknown;
    code: string;
    status: number;
  }) {
    super(message);

    this.data = data;
    this.code = code;
    this.status = status;
  }

  public static isSatispayError(err: unknown): err is SatispayError {
    return err instanceof SatispayError && err.name === "SatispayError";
  }
}
