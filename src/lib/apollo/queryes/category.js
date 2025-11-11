import { gql } from "@apollo/client";

export const GET_CATEGORY_PRODUCTS = gql`
  query Products {
    products(search: "", filter: { price: { from: 0.01 } }) {
      total_count
      aggregations {
        attribute_code
        count
        label
        options {
          label
          value
          count
        }
      }
      items {
        name
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        rating_summary
        review_count
        stock_status
        swatch_image
        image {
          url
        }
        thumbnail {
          url
          label
        }
        url_key
        custom_attributes(filter: ["Theme"]) {
          label
          value
        }
      }
    }
  }
`;
