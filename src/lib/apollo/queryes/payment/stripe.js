import { gql } from "@apollo/client";

export const GET_STRIPE_CONFIGURATION = gql`
  query {
    getStripeConfiguration {
      apiKey
      locale
      appInfo
      options {
        betas
        apiVersion
      }
      elementsOptions
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddStripePaymentMethod($paymentMethodId: String!) {
    addStripePaymentMethod(input: { payment_method: $paymentMethodId }) {
      id
      created
      type
      fingerprint
      label
      icon
      cvc
      brand
      exp_month
      exp_year
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeleteStripePaymentMethod($paymentMethodId: String!) {
    deleteStripePaymentMethod(
      input: { payment_method: $paymentMethodId, fingerprint: null }
    )
  }
`;

export const LIST_PAYMENT_METHODS = gql`
  mutation {
    listStripePaymentMethods {
      id
      created
      type
      fingerprint
      label
      icon
      cvc
      brand
      exp_month
      exp_year
    }
  }
`;
