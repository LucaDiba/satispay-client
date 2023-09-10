<h1 align="center">Satispay Node.js client</h1>
<h2 align="center">⚠️ This package is in beta ⚠️</h2>

<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" />
  <a href="https://www.npmjs.com/package/@lucadiba/satispay-client">
    <img alt="NPM package" src="https://img.shields.io/npm/v/@lucadiba/satispay-client?color=blue" />
  </a>
  <a href="https://github.com/LucaDiba/satispay-client/actions/workflows/main.yml">
    <img alt="CI build" src="https://github.com/LucaDiba/satispay-client/actions/workflows/main.yml/badge.svg" />
  </a>
  <a href="https://github.com/LucaDiba/satispay-client/graphs/commit-activity">
    <img alt="Maintained" src="https://img.shields.io/badge/maintained-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/LucaDiba/satispay-client/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/LucaDiba/satispay-client" />
  </a>
</p>

> A JavaScript Node.js client for Satispay APIs with built-in TypeScript types.<br />
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
import Satispay from "@lucadiba/satispay-client";
```

### Initialize the client

Initialize the client with your `keyId` and `privateKey`. You can get both using this package. See the [Authentication](#authentication) section for more details.

```typescript
const satispay = new Satispay.Client({
  keyId: "ldg9sbq283og7ua1abpj989kbbm2g60us6f18c1sciq...",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...",
  environment: "sandbox", // optional, defaults to "production"
});
```

### Create a payment

```typescript
const paymentResponse = await satispay.payments.create({
  flow: "MATCH_CODE",
  amountUnit: 100,
  currency: "EUR",
});

if (paymentResponse.success) {
  const payment = paymentResponse.data;

  // Save the payment id
  const paymentId = payment.id;

  // Redirect the user to the redirectUrl
  const redirectUrl = payment.redirect_url;

  // ...
} else {
  // Handle the error
  const error = paymentResponse.error;
}
```

### Get a payment

```typescript
satispay.payments.get({
  id: "payment_id",
});
```

### Get all payments

```typescript
satispay.payments.getAll();
```

### Update a payment

```typescript
satispay.payments.update({
  id: "payment_id",
  action: "CANCEL",
});
```

## Authentication

The Satispay API uses an authentication method based on a RSA key pair. You can generate a new key pair using the `generateKeyPair` method:

```typescript
import Satispay from "@lucadiba/satispay-client";

const { publicKey, privateKey } =
  await Satispay.Authentication.generateKeyPair();
```

Then, you can use the `authenticateWithToken` method to get the `keyId` needed to initialize the client.
The token is a 6 characters string that you can find in the Satispay Business Dashboard. It can only be used once, so you need to save the `keyId`, which can be reused and does not expire.

```typescript
const { keyId } = await Satispay.Authentication.authenticateWithToken({
  token: "623ECX",
  publicKey,
});
```

Finally, you can initialize the client:

```typescript
const satispay = new Satispay.Client({
  keyId,
  privateKey,
});
```

## Contributing

Contributions, issues and feature requests are welcome!

## License

Copyright © 2022 [Luca Dibattista](https://github.com/LucaDiba).<br />
This project is [MIT](https://github.com/LucaDiba/satispay-client/blob/main/LICENSE) licensed.
