import { gql } from "@apollo/client";

export const SEND_EMAIL = gql`
  mutation SendEmail($input: ContactusInput!) {
    contactusFormSubmit(input: $input) {
      success_message
    }
  }
`;
