import { gql } from "@apollo/client";

export const GET_CUSTOMER_ADDRESS_DATA = gql`
  query Customer {
    customer {
      addresses {
        city
        company
        country_code
        country_id
        customer_id
        default_billing
        default_shipping
        fax
        firstname
        id
        lastname
        middlename
        postcode
        prefix
        region_id
        street
        suffix
        telephone
        vat_id
        region {
          region
          region_code
          region_id
        }
      }
    }
  }
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation DeleteCustomerAddress($id: Int!) {
    deleteCustomerAddress(id: $id)
  }
`;
