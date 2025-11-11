import { gql } from "@apollo/client";

export const COUNTRIES = gql`
  query Countries {
    countries {
      full_name_english
      full_name_locale
      id
      three_letter_abbreviation
      two_letter_abbreviation
      available_regions {
        code
        id
        name
      }
    }
  }
`;

export const VERIFY_RECAPTCHA = gql`
  mutation VerifyRecaptcha($token: String!) {
    verifyRecaptcha(token: $token) {
      success
      errorCodes
    }
  }
`;

export const SUBMIT_INNOVATIVE_IDEA_FORM = gql`
  mutation SubmitInnovativeIdea($input: submitInnovativeIdeaFormInput!) {
    submitForm(input: $input) {
      success
      message
    }
  }
`;

export const SET_QUOTE_REFERRAL_FACTORY_LINK = gql`
  mutation SetQuoteReferralFactoryLink(
    $cart_id: String!
    $code: String!
    $referrer: String
    $is_mobile: Boolean
    $ip_address: String
  ) {
    setQuoteReferralFactoryLink(
      cart_id: $cart_id
      code: $code
      referrer: $referrer
      is_mobile: $is_mobile
      ip_address: $ip_address
    ) {
      unique_code
    }
  }
`;
