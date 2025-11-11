import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateCustomer(
    $email: String!
    $firstname: String!
    $lastname: String!
    $password: String!
    $phone_number: String!
    $is_subscribed: Boolean!
    $sms_alert: String!
  ) {
    createCustomerV2(
      input: {
        email: $email
        firstname: $firstname
        lastname: $lastname
        password: $password
        is_subscribed: $is_subscribed
        custom_attributes: [
          { attribute_code: "phone_number", value: $phone_number }
          { attribute_code: "sms_alert", value: $sms_alert }
        ]
      }
    ) {
      customer {
        id
        group_id
        email
        firstname
        lastname
      }
      cus_id
    }
  }
`;

export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      phone
      token
      is_email_verification
      is_otp_verification
      two_factor_authentication
    }
  }
`;

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
          region_id
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress(
    $id: Int!
    $country_code: CountryCodeEnum!
    $street: [String!]!
    $telephone: String!
    $postcode: String!
    $city: String!
    $firstname: String!
    $lastname: String!
    $company: String
    $default_shipping: Boolean!
    $default_billing: Boolean!
    $region: CustomerAddressRegionInput!
  ) {
    updateCustomerAddress(
      id: $id
      input: {
        country_code: $country_code
        street: $street
        telephone: $telephone
        postcode: $postcode
        city: $city
        firstname: $firstname
        lastname: $lastname
        company: $company
        region: $region
        default_shipping: $default_shipping
        default_billing: $default_billing
      }
    ) {
      id
      firstname
      lastname
      region {
        region
        region_code
        region_id
      }
      country_code
      street
      telephone
      postcode
      city
      company
      default_shipping
      default_billing
    }
  }
`;

export const GET_CUSTOMER_ACCOUNT_DATA = gql`
  query Customer {
    customer {
      created_at
      date_of_birth
      dob
      email
      firstname
      gender
      group_id
      id
      is_subscribed
      lastname
      middlename
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
    }
  }
`;

export const GET_CUSTOMER_DATA = gql`
  query Customer {
    customer {
      allow_remote_shopping_assistance
      created_at
      date_of_birth
      default_billing
      default_shipping
      dob
      email
      firstname
      gender
      group_id
      id
      is_subscribed
      lastname
      middlename
      prefix
      suffix
      taxvat
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
      orders(sort: { sort_field: CREATED_AT, sort_direction: DESC }) {
        total_count
        items {
          payment_methods {
            name
          }
          carrier
          created_at
          grand_total
          id
          increment_id
          number
          order_date
          order_number
          shipping_method
          status
          stripe_payment {
            id
            icon
            label
          }
          shipbob_shipment {
            order_id
            id
            reference_id
            created_date
            status
            status_details {
              id
              name
              description
            }
          }
          shipbob_shipment_time_line {
            log_type_id
            id
            log_type_name
            log_type_text
            timestamp
          }
          total {
            total_tax {
              currency
              value
            }
            base_grand_total {
              currency
              value
            }
            discounts {
              label
              amount {
                currency
                value
              }
            }
            grand_total {
              currency
              value
            }
            shipping_handling {
              total_amount {
                currency
                value
              }
            }
            subtotal {
              currency
              value
            }
            taxes {
              rate
              title
            }
            total_shipping {
              currency
              value
            }
          }
          items {
            product_sku
          }
          billing_address {
            city
            company
            country_code
            fax
            firstname
            lastname
            middlename
            postcode
            prefix
            region
            region_id
            street
            suffix
            telephone
            vat_id
          }
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
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
        region {
          region
          region_id
          region_code
        }
        region_id
        street
        suffix
        telephone
        vat_id
      }
    }
  }
`;

export const GET_CUSTOMER_PAYMENT_DATA = gql`
  query Customer($orderId: String!) {
    customer {
      allow_remote_shopping_assistance
      created_at
      date_of_birth
      default_billing
      default_shipping
      dob
      email
      firstname
      gender
      group_id
      id
      is_subscribed
      lastname
      middlename
      prefix
      suffix
      taxvat
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
      orders(filter: { number: { eq: $orderId } }) {
        total_count
        items {
          carrier
          created_at
          grand_total
          id
          increment_id
          number
          order_date
          order_number
          shipping_method
          status
          total {
            total_tax {
              currency
              value
            }
            base_grand_total {
              currency
              value
            }
            discounts {
              label
              amount {
                currency
                value
              }
            }
            grand_total {
              currency
              value
            }
            shipping_handling {
              total_amount {
                currency
                value
              }
            }
            subtotal {
              currency
              value
            }
            taxes {
              rate
              title
            }
            total_shipping {
              currency
              value
            }
          }
          items {
            product_sku
            product_name
            product_sale_price {
              value
              currency
            }
            quantity_ordered
          }
          billing_address {
            city
            company
            country_code
            fax
            firstname
            lastname
            middlename
            postcode
            prefix
            region
            region_id
            street
            suffix
            telephone
            vat_id
          }
          invoices {
            id
            pdf_url
          }
          payment_methods {
            name
            type
            additional_data {
              name
              value
            }
          }
          shipping_address {
            city
            company
            country_code
            fax
            firstname
            lastname
            middlename
            postcode
            prefix
            region
            region_id
            street
            suffix
            telephone
            vat_id
          }
          shipbob_shipment {
            order_id
            id
            reference_id
            created_date
            status
            status_details {
              id
              name
              description
            }
          }
          shipbob_shipment_time_line {
            log_type_id
            id
            log_type_name
            log_type_text
            timestamp
          }
          shipments {
            id
            number
          }
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
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
      }
    }
  }
`;

export const GET_CUSTOMER_AND_ORDER_DATA = gql`
  query Customer($orderId: String!) {
    customer {
      email
      firstname
      lastname
      middlename
      prefix
      suffix
      orders(filter: { number: { eq: $orderId } }) {
        items {
          mp_pre_order_notice
          created_at
          grand_total
          id
          increment_id
          number
          order_date
          order_number
          shipping_method
          status
          stripe_payment {
            id
            icon
            label
          }
          total {
            total_tax {
              currency
              value
            }
            payment_fee {
              currency
              value
            }
            base_grand_total {
              currency
              value
            }
            discounts {
              label
              amount {
                currency
                value
              }
            }
            grand_total {
              currency
              value
            }
            shipping_handling {
              total_amount {
                currency
                value
              }
            }
            subtotal {
              currency
              value
            }
            taxes {
              rate
              title
            }
            total_shipping {
              currency
              value
            }
          }
          items {
            product_sku
            product_name
            product_sale_price {
              value
              currency
            }
            quantity_ordered
            product {
              id
              mp_pre_order {
                stock_notice
                button_label
                children
                option_map
              }
            }
          }
          billing_address {
            city
            company
            country_code
            fax
            firstname
            lastname
            middlename
            postcode
            prefix
            region
            region_id
            street
            suffix
            telephone
            vat_id
          }
          payment_methods {
            name
            type
            additional_data {
              name
              value
            }
          }
          shipping_address {
            city
            company
            country_code
            fax
            firstname
            lastname
            middlename
            postcode
            prefix
            region
            region_id
            street
            suffix
            telephone
            vat_id
          }
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
    }
  }
`;

export const GET_SHORT_CUSTOMER_DATA = gql`
  query Customer {
    customer {
      firstname
      lastname
      email
      date_of_birth
      gender
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
    }
  }
`;

export const GET_CUSTOMER_RECENT_ORDERS = gql`
  query Customer {
    customer {
      allow_remote_shopping_assistance
      created_at
      date_of_birth
      default_billing
      default_shipping
      dob
      email
      firstname
      gender
      group_id
      id
      is_subscribed
      lastname
      middlename
      prefix
      suffix
      taxvat
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
      orders(sort: { sort_field: CREATED_AT, sort_direction: DESC }) {
        total_count
        items {
          payment_methods {
            name
          }
          created_at
          grand_total
          id
          increment_id
          number
          order_date
          order_number
          shipping_method
          status
          billing_address {
            firstname
            lastname
          }
          total {
            grand_total {
              currency
              value
            }
          }
          stripe_payment {
            id
            icon
            label
          }
          shipbob_shipment {
            order_id
            id
            reference_id
            created_date
            status
            status_details {
              id
              name
              description
            }
          }
          aftership_shipment_time_line {
            orderId
            transitTime
            pickedUpDate
            deliveredDate
            status
            origin {
              city
              state
              country
              postalCode
            }
            destination {
              city
              state
              country
              postalCode
            }
            checkpoints {
              time
              status
              location
              city
              state
              message
              slug
              subtag
            }
          }
          shipments {
            number
          }
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ORDER = gql`
  query Customer($orderId: String) {
    customer {
      orders(
        sort: { sort_field: CREATED_AT, sort_direction: DESC }
        filter: { number: { eq: $orderId } }
      ) {
        total_count
        items {
          status
          order_date
          order_number
          number
          token
          email
          shipping_method
          stripe_payment {
            id
            icon
            label
          }
          total {
            total_tax {
              currency
              value
            }
            base_grand_total {
              currency
              value
            }
            discounts {
              label
              amount {
                currency
                value
              }
            }
            grand_total {
              currency
              value
            }
            shipping_handling {
              total_amount {
                currency
                value
              }
            }
            subtotal {
              currency
              value
            }
            taxes {
              rate
              title
            }
            total_shipping {
              currency
              value
            }
          }
          payment_methods {
            name
            type
            additional_data {
              name
              value
            }
          }
          items {
            product_sku
            product_name
            product_sale_price {
              value
            }
            quantity_ordered
          }
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_INFO = gql`
  mutation UpdateCustomerV2($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        id
      }
    }
  }
`;

export const UPDATE_CUSTOMER_PROFILE_IMAGE = gql`
  mutation ($profile_url: String!) {
    updateCustomerV2(
      input: {
        custom_attributes: [
          { attribute_code: "profile_pic", value: $profile_url }
        ]
      }
    ) {
      customer {
        custom_attributes {
          code
          ... on AttributeValue {
            value
          }
          ... on AttributeSelectedOptions {
            selected_options {
              label
              value
            }
          }
        }
      }
    }
  }
`;

export const CHECK_CUSTOMER_EMAIL = gql`
  query CheckCustomerEmail($email: String!) {
    checkCustomerEmail(email: $email) {
      success
    }
  }
`;

export const CHECK_CUSTOMER_PHONE = gql`
  query CheckCustomerPhone($phone: String!) {
    checkCustomerPhone(phone: $phone) {
      success
    }
  }
`;

export const REFRESH_CUSTOMER_TOKEN = gql`
  mutation refreshCustomerToken {
    refreshCustomerToken {
      token
    }
  }
`;

export const GET_GUEST_ORDER_DETAIL = gql`
  query GetGuestOrderDetail(
    $number: String!
    $email: String!
    $postcode: String!
  ) {
    guestOrder(input: { number: $number, email: $email, postcode: $postcode }) {
      status
      order_date
      number
      token
      email
      shipping_method
      total {
        payment_fee {
          currency
          value
        }
        total_tax {
          currency
          value
        }
        base_grand_total {
          currency
          value
        }
        discounts {
          label
          amount {
            currency
            value
          }
        }
        grand_total {
          currency
          value
        }
        shipping_handling {
          total_amount {
            currency
            value
          }
        }
        subtotal {
          currency
          value
        }
        taxes {
          rate
          title
        }
        total_shipping {
          currency
          value
        }
      }
      billing_address {
        firstname
        lastname
        city
        region
        region_id
        street
        postcode
        country_code
        telephone
      }
      stripe_payment {
        id
        icon
        label
      }
      payment_methods {
        name
        type
        additional_data {
          name
          value
        }
      }
      shipping_address {
        firstname
        lastname
        city
        region
        region_id
        street
        postcode
        country_code
        telephone
      }
      items {
        product_sku
        product_name
        product_sale_price {
          value
        }
        quantity_ordered
      }
    }
  }
`;

export const DELETE_CUSTOMER_ACCOUNT = gql`
  mutation mpGdprDeleteCustomerAccountRequest($input: DeletedCustomerInput!) {
    mpGdprDeleteCustomerAccountRequest(input: $input) {
      result
    }
  }
`;

export const DELETE_ACCOUNT_REASONS = gql`
  query {
    getDeleteReasons
  }
`;

export const GET_ACCOUNT_DATA = gql`
  query Customer {
    customer {
      firstname
      lastname
      email
      date_of_birth
      gender
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
        ... on AttributeSelectedOptions {
          selected_options {
            label
            value
          }
        }
      }
    }
  }
`;

export const ADD_CUSTOMER_ADDRESS = gql`
  mutation AddCustomerAddress(
    $region: CustomerAddressRegionInput!
    $country_code: CountryCodeEnum!
    $street: [String!]!
    $telephone: String!
    $postcode: String!
    $city: String!
    $firstname: String!
    $lastname: String!
    $default_shipping: Boolean!
    $default_billing: Boolean!
  ) {
    createCustomerAddress(
      input: {
        region: $region
        country_code: $country_code
        street: $street
        telephone: $telephone
        postcode: $postcode
        city: $city
        firstname: $firstname
        lastname: $lastname
        default_shipping: $default_shipping
        default_billing: $default_billing
      }
    ) {
      id
      firstname
      lastname
      region {
        region
        region_code
        region_id
      }
      country_code
      street
      telephone
      postcode
      city
      default_shipping
      default_billing
    }
  }
`;

export const SET_DEFAULT_PAYMENT_METHOD = gql`
  mutation ($default_payment: String!) {
    updateCustomerV2(
      input: {
        custom_attributes: [
          { attribute_code: "default_payment", value: $default_payment }
        ]
      }
    ) {
      customer {
        custom_attributes {
          code
          ... on AttributeValue {
            value
          }
          ... on AttributeSelectedOptions {
            selected_options {
              label
              value
            }
          }
        }
      }
    }
  }
`;
