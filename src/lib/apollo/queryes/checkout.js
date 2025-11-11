import { gql } from "@apollo/client";

export const SET_SHIPPING_ADDRESSES = gql`
  mutation SetShippingAddressesOnCart(
    $cart_id: String!
    $city: String!
    $country_code: String!
    $firstname: String!
    $lastname: String!
    $postcode: String!
    $region: String
    $region_id: Int!
    $save_in_address_book: Boolean!
    $street: [String]!
    $telephone: String!
  ) {
    setShippingAddressesOnCart(
      input: {
        cart_id: $cart_id
        shipping_addresses: {
          address: {
            firstname: $firstname
            lastname: $lastname
            street: $street
            city: $city
            region: $region
            region_id: $region_id
            postcode: $postcode
            country_code: $country_code
            telephone: $telephone
            save_in_address_book: $save_in_address_book
          }
          customer_notes: null
        }
      }
    ) {
      cart {
        email
        id
        is_virtual
        total_quantity
        available_payment_methods {
          code
          title
        }
        selected_payment_method {
          code
          purchase_order_number
          title
        }
        shipping_addresses {
          city
          region {
            code
            label
            region_id
          }
          company
          customer_notes
          firstname
          items_weight
          lastname
          pickup_location_code
          postcode
          street
          telephone
          available_shipping_methods {
            available
            carrier_code
            carrier_title
            error_message
            method_code
            method_title
            price_incl_tax {
              currency
              value
            }
          }
        }
      }
    }
  }
`;

export const SET_BILLING_ADDRESSES = gql`
  mutation SetBillingAddressOnCart(
    $cart_id: String!
    $city: String!
    $country_code: String!
    $firstname: String!
    $lastname: String!
    $postcode: String!
    $region: String
    $region_id: Int!
    $save_in_address_book: Boolean!
    $street: [String]!
    $telephone: String!
  ) {
    setBillingAddressOnCart(
      input: {
        cart_id: $cart_id
        billing_address: {
          address: {
            city: $city
            country_code: $country_code
            firstname: $firstname
            lastname: $lastname
            postcode: $postcode
            region: $region
            region_id: $region_id
            save_in_address_book: $save_in_address_book
            street: $street
            telephone: $telephone
          }
          same_as_shipping: null
          use_for_shipping: null
        }
      }
    ) {
      cart {
        email
        id
        is_virtual
        total_quantity
        items {
          id
          quantity
          uid
          product {
            attribute_set_id
            canonical_url
            color
            country_of_manufacture
            created_at
            gift_message_available
            id
            meta_description
            meta_keyword
            meta_title
            name
            new_from_date
            new_to_date
            only_x_left_in_stock
            options_container
            rating_summary
            review_count
            sku
            special_from_date
            special_price
            special_to_date
            stock_status
            swatch_image
            type_id
            uid
            updated_at
            url_key
            url_path
            url_suffix
          }
        }
      }
    }
  }
`;

export const SET_SHIPPING_METHODS = gql`
  mutation SetShippingMethodsOnCart(
    $cart_id: String!
    $method_code: String!
    $carrier_code: String!
  ) {
    setShippingMethodsOnCart(
      input: {
        cart_id: $cart_id
        shipping_methods: {
          method_code: $method_code
          carrier_code: $carrier_code
        }
      }
    ) {
      cart {
        email
        id
        is_virtual
        total_quantity
        shipping_addresses {
          city
          company
          customer_notes
          firstname
          items_weight
          lastname
          pickup_location_code
          postcode
          street
          telephone
          selected_shipping_method {
            carrier_code
            carrier_title
            method_code
            method_title
          }
        }
      }
    }
  }
`;

export const SET_PAYMENT_METHOD_AND_PLACE_ORDER = gql`
  mutation SetPaymentMethodAndPlaceOrder(
    $cart_id: String!
    $payment_id: String!
  ) {
    setPaymentMethodAndPlaceOrder(
      input: {
        cart_id: $cart_id
        payment_method: {
          stripe_payments: {
            save_payment_method: true
            payment_method: $payment_id
          }
          code: "stripe_payments"
        }
      }
    ) {
      order {
        client_secret
        order_id
        order_number
      }
    }
  }
`;

export const CHECKOUT_SET_PAYMENT_METHOD_IN_CART = gql`
  mutation setPaymentMethodOnCart($cartId: String!, $payment_id: String!) {
    setPaymentMethodOnCart(
      input: {
        cart_id: $cartId
        payment_method: {
          stripe_payments: {
            save_payment_method: true
            payment_method: $payment_id
          }
          code: "stripe_payments"
        }
      }
    ) {
      cart {
        selected_payment_method {
          code
        }
      }
    }
  }
`;

export const SET_FREE_PAYMENT_METHOD_AND_PLACE_ORDER = gql`
  mutation SetPaymentMethodAndPlaceOrder($cart_id: String!) {
    setPaymentMethodAndPlaceOrder(
      input: { cart_id: $cart_id, payment_method: { code: "free" } }
    ) {
      order {
        client_secret
        order_id
        order_number
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation placeOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      orderV2 {
        number
        token
      }
      errors {
        message
        code
      }
    }
  }
`;

export const SET_GUEST_EMAIL_ON_CART = gql`
  mutation SetGuestEmailOnCart($cart_id: String!, $email: String!) {
    setGuestEmailOnCart(input: { cart_id: $cart_id, email: $email }) {
      cart {
        email
      }
    }
  }
`;

export const APPLY_COUPON_TO_CART = gql`
  mutation applyCouponToCart($cart_id: String!, $coupon_code: String!) {
    applyCouponToCart(input: { cart_id: $cart_id, coupon_code: $coupon_code }) {
      cart {
        itemsV2 {
          items {
            product {
              name
            }
            quantity
          }
          total_count
          page_info {
            page_size
            current_page
            total_pages
          }
        }
        applied_coupons {
          code
        }
        prices {
          grand_total {
            value
            currency
          }
        }
      }
    }
  }
`;

export const REMOVE_COUPON_FROM_CART = gql`
  mutation removeCouponFromCart($cart_id: String!) {
    removeCouponFromCart(input: { cart_id: $cart_id }) {
      cart {
        applied_coupons {
          code
        }
      }
    }
  }
`;

export const GET_VALID_COUPONS = gql`
  query {
    valid_coupons {
      code
      discount
      days_left
      simple_action
    }
  }
`;
