---
"@lucadiba/satispay-client": major
---

# Breaking changes

## Errors

Before this change, the library returned the following object for all the Client requests:

```typescript
const paymentResponse = await satispay.payments.create({
  flow: "MATCH_CODE",
  amountUnit: 100,
  currency: "EUR",
});

/**
 * paymentResponse: {
 *   success: true,
 *   data: {
 *     ...
 *   }
 * } | {
 *   success: false,
 *   error: {
 *     ...
 *   }
 * }
 */

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

After this change, the library will directly throw an error if the request fails.
If the request is successful, the library will return the successful response.

```typescript
try {
  const payment = await satispay.payments.create({
    flow: "MATCH_CODE",
    amountUnit: 100,
    currency: "EUR",
  });

  // Save the payment id
  const paymentId = payment.id;

  // Redirect the user to the redirectUrl
  const redirectUrl = payment.redirect_url;

  // ...
} catch (error) {
  // Handle the error
}
```

The error type `SatispayError` has been introduced. It extends the `Error` class and has the following properties:

- `name: string` - The error name
- `message: string` - The error message
- `code: string` - The error code
- `status: number` - The HTTP status code

It is possible to check the error type using the `isSatispayError` utility function.
If the result is true, the error type `SatispayError` is automatically inferred.

```typescript
import { SatispayError } from "@lucadiba/satispay-client";

try {
  // ...
} catch (error) {
  if (SatispayError.isSatispayError(error)) {
    // The SatispayError type is automatically inferred to the error variable
  } else {
    // The type of the error variable is unknown
  }
}
```
