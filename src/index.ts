import SatispayError from "./errors/SatispayError";
import { Authentication } from "./modules/authentication";
import { Client } from "./modules/client";

export const Satispay = {
  Client,
  Authentication,
  SatispayError,
};

export default Satispay;
