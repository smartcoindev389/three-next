import { gql } from "@apollo/client";

export const GET_REVIEW_BY_HASH = gql`
  query ReviewData($hash: String!) {
    GetReviewDataByCache(hash: $hash) {
      order {
        id
        status
        shipping_address {
          firstname
          lastname
          middlename
          region
          region_id
          street
          company
          telephone
          fax
          postcode
          city
          prefix
          suffix
          vat_id
        }
      }
      product {
        id
        sku
        name
        type_id
        image {
          url
          label
        }
      }
      status
    }
  }
`;
