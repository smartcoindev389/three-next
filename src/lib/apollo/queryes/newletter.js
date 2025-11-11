import { gql } from "@apollo/client";

export const SUBSCRIBE_EMAIL_TO_NEWSLETTER = gql`
  mutation subscribeEmailToNewsletter($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`;

export const UPDATE_CUSTOMER_NEWSLETTER_MUTATION = gql`
  mutation UpdateCustomerNewsletter($is_subscribed: Boolean!) {
    updateCustomer(input: { is_subscribed: $is_subscribed }) {
      customer {
        firstname
        is_subscribed
      }
    }
  }
`;

export const SMS_TEXT_ALERT = gql`
  mutation updateCustomerV2($sms_alert: String!) {
    updateCustomerV2(
      input: {
        custom_attributes: [{ attribute_code: "sms_alert", value: $sms_alert }]
      }
    ) {
      customer {
        custom_attributes {
          code
          ... on AttributeValue {
            value
          }
        }
      }
    }
  }
`;
