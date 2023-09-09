import { Payments } from "./payments";

export type ClientOptions = {
  keyId: string;
  privateKey: string;

  /**
   * The environment to use for the API calls.
   *
   * @default "production"
   */
  environment?: "production" | "sandbox";
};

export class Client {
  constructor(options: ClientOptions) {
    this.payments = new Payments(options);
  }

  public payments: Payments;
}
