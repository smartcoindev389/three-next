import { gql } from "@apollo/client";

export const CHECKOUT_SESSION_CONFIG = gql`
  query checkoutSessionConfig($cartId: String!, $omitPayloads: Boolean!) {
    checkoutSessionConfig(cartId: $cartId, omitPayloads: $omitPayloads) {
      button_color
      checkout_payload
      checkout_signature
      currency
      sandbox
      language
      login_payload
      login_signature
      merchant_id
      pay_only
      paynow_payload
      paynow_signature
      public_key_id
    }
  }
`;

export const CHECKOUT_PLACE_ORDER_AMAZON = gql`
  mutation completeCheckoutSession(
    $cartId: String!
    $amazonSessionId: String!
  ) {
    completeCheckoutSession(
      cartId: $cartId
      amazonSessionId: $amazonSessionId
    ) {
      increment_id
      message
      success
    }
  }
`;

export const CHECKOUT_SET_PAYMENT_METHOD_IN_CART = gql`
  mutation setPaymentMethodOnCart($cartId: String!, $paymentMethod: String!) {
    setPaymentMethodOnCart(
      input: { cart_id: $cartId, payment_method: { code: $paymentMethod } }
    ) {
      cart {
        selected_payment_method {
          code
        }
      }
    }
  }
`;

export const UPDATE_CHECKOUT_SESSION = gql`
  mutation updateCheckoutSession($cartId: String!, $amazonSessionId: String!) {
    updateCheckoutSession(cartId: $cartId, amazonSessionId: $amazonSessionId) {
      redirectUrl
    }
  }
`;
