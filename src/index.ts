import SatispayError from "./errors/SatispayError";
import { Authentication } from "./modules/authentication";
import { Client } from "./modules/client";

const Satispay = {
  Client,
  Authentication,
  SatispayError,
};

export default Satispay;
