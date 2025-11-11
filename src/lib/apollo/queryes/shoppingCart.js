import { gql } from "@apollo/client";

export const ADD_PRODUCTS_TO_CART = gql`
  mutation AddProductsToCart(
    $cartId: String!
    $quantity: Float!
    $sku: String!
  ) {
    addProductsToCart(
      cartId: $cartId
      cartItems: { quantity: $quantity, sku: $sku }
    ) {
      cart {
        id
        items {
          id
          product {
            id
            name
            sku
            price {
              regularPrice {
                amount {
                  currency
                  value
                }
              }
            }
            color
          }
          quantity
        }
        prices {
          grand_total {
            currency
            value
          }
        }
      }
    }
  }
`;

export const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($cart_id: String!, $cart_item_id: Int!) {
    removeItemFromCart(
      input: { cart_id: $cart_id, cart_item_id: $cart_item_id }
    ) {
      cart {
        total_quantity
      }
    }
  }
`;

export const UPDATE_CART_ITEMS = gql`
  mutation UpdateCartItems(
    $cart_id: String!
    $cart_item_id: Int!
    $quantity: Float!
  ) {
    updateCartItems(
      input: {
        cart_id: $cart_id
        cart_items: { cart_item_id: $cart_item_id, quantity: $quantity }
      }
    ) {
      cart {
        id
      }
    }
  }
`;

export const MERGE_CART = gql`
  mutation MergeCarts($source_cart_id: String!) {
    mergeCarts(source_cart_id: $source_cart_id) {
      id
      items {
        product {
          name
          sku
        }
      }
    }
  }
`;

export const CUSTOMER_CART = gql`
  query CustomerCart {
    customerCart {
      id
      total_quantity
      mp_pre_order_notice
      items {
        id
        quantity
        product {
          name
          sku
          image {
            disabled
            label
            position
            url
          }
          price {
            regularPrice {
              amount {
                currency
                value
              }
            }
          }
          color
        }
        quantity
      }
      prices {
        grand_total {
          value
        }
      }
    }
  }
`;
export const CUSTOMER_CART_ID = gql`
  query CustomerCart {
    customerCart {
      id
    }
  }
`;

export const CART = gql`
  query Cart($cart_id: String!) {
    cart(cart_id: $cart_id) {
      id
      total_quantity
      mp_pre_order_notice
      items {
        id
        product {
          id
          stock_status
          name
          sku
          image {
            disabled
            label
            position
            url
          }
          price {
            regularPrice {
              amount {
                currency
                value
              }
            }
          }
        }
        quantity
        mp_pre_order_message
      }
      prices {
        grand_total {
          value
          currency
        }
      }
      email
      billing_address {
        uid
        city
        country {
          code
          label
        }
        firstname
        lastname
        postcode
        region {
          code
          label
          region_id
        }
        street
        telephone
      }
      shipping_addresses {
        uid
        firstname
        lastname
        street
        postcode
        city
        region {
          code
          label
          region_id
        }
        country {
          code
          label
        }
        telephone
        available_shipping_methods {
          amount {
            currency
            value
          }
          available
          carrier_code
          carrier_title
          error_message
          method_code
          method_title
          price_excl_tax {
            value
            currency
          }
          price_incl_tax {
            value
            currency
          }
        }
        selected_shipping_method {
          amount {
            value
            currency
          }
          carrier_code
          carrier_title
          method_code
          method_title
        }
      }
      itemsV2 {
        total_count
        items {
          id
          uid
          product {
            stock_status
            name
            sku
          }
          quantity
          prices {
            total_item_discount {
              value
            }
            price {
              value
            }
            discounts {
              label
              amount {
                value
              }
            }
          }
        }
        page_info {
          page_size
          current_page
          total_pages
        }
      }
      available_payment_methods {
        code
        title
      }
      selected_payment_method {
        code
        title
      }
      applied_coupons {
        code
      }
      prices {
        grand_total {
          value
          currency
        }
        referral_discount {
          value
        }
        payment_fee {
          amount {
            value
          }
        }
        applied_taxes {
          label
          amount {
            currency
            value
          }
        }
        discounts {
          amount {
            value
          }
          applied_to
          label
        }
      }
    }
  }
`;

export const CREATE_CUSTOMER_CART_RAW = gql`
  {
    customerCart {
      id
    }
  }
`;

export const CREATE_GUEST_CART_RAW = gql`
  mutation {
    createGuestCart {
      cart {
        id
      }
    }
  }
`;

export const NOTIFY_WHEN_IN_STOCK = gql`
  mutation NotifyInStock($email: String!, $productSku: String!) {
    MpProductAlertNotifyInStock(
      input: { email: $email, productSku: $productSku }
    ) {
      subscriber_id
      customer_email
      product_id
    }
  }
`;
