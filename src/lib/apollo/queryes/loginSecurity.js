import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_2FA = gql`
  mutation updateCustomerV2($two_factor_authentication: String!) {
    updateCustomerV2(
      input: {
        custom_attributes: [
          {
            attribute_code: "two_factor_authentication"
            value: $two_factor_authentication
          }
        ]
      }
    ) {
      customer {
        id
      }
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangeCustomerPassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    changeCustomerPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      id
      email
    }
  }
`;
