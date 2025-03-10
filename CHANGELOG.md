# @lucadiba/satispay-client

## 1.0.2

### Patch Changes

- ff90e04: - Address type issue in ESM modules.
  - Bump dependencies

## 1.0.1

### Patch Changes

- 1b3126b: Bump dependencies

## 1.0.0

### Major Changes

- d66664d: # Breaking changes

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

## 0.1.6

### Patch Changes

- 2c9ee9d: Bump dependencies

## 0.1.5

### Patch Changes

- 99fa769: Add metadata to "create payment"

## 0.1.4

### Patch Changes

- 59a72b1: Fix timezone offset when signing request

## 0.1.3

### Patch Changes

- 70c6d7d: Fix publish workflow

## 0.1.2

### Patch Changes

- Add keywords

## 0.1.1

### Patch Changes

- Create LICENSE

## 0.1.0

### Minor Changes

- 0355ff0: Initial version
