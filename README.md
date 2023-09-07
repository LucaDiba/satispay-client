<h1 align="center">Satispay client</h1>
<h2 align="center">⚠️ This package is in alpha ⚠️</h2>

> A JavaScript client for Satispay APIs with built-in TypeScript types.<br />
> This package supports both ESM and CommonJS.

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#authentication">Authentication</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Installation

Install the package using your preferred package manager:

```bash
npm install @lucadiba/satispay-client
```

## Usage

Import the package in your Node.js application:

```typescript
import SatispayClient from "@lucadiba/satispay-client";
```

### Initialize the Client

You can get the `keyId` and `privateKey` using this package. See the [Authentication](#authentication) section for more details.

```typescript
const satispay = new SatispayClient({
  keyId: "ldg9sbq283og7ua1abpj989kbbm2g60us6f18c1sciq...",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...",
  environment: "sandbox", // or 'production'
});
```

### Create a Payment

```typescript
const paymentResponse = await satispay.payments.create({
  flow: "MATCH_CODE",
  amountUnit: 100,
  currency: "EUR",
});

if (paymentResponse.success) {
  const payment = paymentResponse.data;
  const paymentId = payment.id;
  // ...
}
```

### Get a Payment

```typescript
satispay.payments.get({
  id: "payment_id",
});
```

### Get All Payments

```typescript
satispay.payments.getAll();
```

## Authentication

The Satispay API uses an authentication method based on a RSA key pair. You can generate a new key pair using the `generateKeyPair` method:

```typescript
import { SatispayAuthentication } from "@lucadiba/satispay-client";

const { publicKey, privateKey } = SatispayAuthentication.generateKeyPair();
```

Then, you can use the `authenticateWithKeyPair` method to get the `keyId` needed to initialize the client.
The token is a 6 characters string that you can find in the Satispay Business Dashboard. It can only be used once, so you need to save the `keyId`, which can be reused and does not expire.

```typescript
const { keyId } = SatispayAuthentication.authenticateWithToken({
  token: "623ECX",
  publicKey,
});

const satispay = new SatispayClient({
  keyId,
  privateKey,
});
```

## Contributing

Contributions, issues and feature requests are welcome!

## License

Copyright © 2022 [Luca Dibattista](https://github.com/LucaDiba).<br />
This project is MIT licensed.
