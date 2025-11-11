import { gql } from "@apollo/client";

export const TWILIO_SEND = gql`
  query TwilioSend($contact: String!, $channel: String!) {
    twiliosend(contact: $contact, channel: $channel) {
      status
    }
  }
`;

export const TWILIO_VERIFY = gql`
  query TwilioVerify($contact: String!, $code: String!) {
    twilioverify(contact: $contact, code: $code) {
      status
    }
  }
`;

export const TWILIO_LOGIN = gql`
  mutation TwilioLogin($contact: String!, $code: String!, $channel: String!) {
    twiliologin(contact: $contact, code: $code, channel: $channel) {
      access_token
      is_email_verified
      is_otp_verified
      two_factor_authentication
      contact
    }
  }
`;

export const TWILIO_UPDATE_CONTACT = gql`
  mutation TwilioUpdateContact(
    $contact: String!
    $code: String!
    $channel: String!
  ) {
    twiliocontactupdate(contact: $contact, code: $code, channel: $channel) {
      id
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    requestPasswordResetEmail(email: $email)
  }
`;

export const SET_NEW_PASSWORD = gql`
  mutation resetPassword(
    $email: String!
    $resetPasswordToken: String!
    $newPassword: String!
  ) {
    resetPassword(
      email: $email
      resetPasswordToken: $resetPasswordToken
      newPassword: $newPassword
    )
  }
`;

export const SSOLogin = gql`
  mutation SSOLogin($token: String!, $provider: String!) {
    ssosignin(access_token: $token, provider: $provider) {
      token
    }
  }
`;
