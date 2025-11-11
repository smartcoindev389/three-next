import { gql } from "@apollo/client";

export const GET_PRODUCT_DATA = gql`
  query Route($url: String!) {
    route(url: $url) {
      ... on SimpleProduct {
        id
        sku
        name
        url_key
        stock_status
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        description {
          html
        }
        short_description {
          html
        }
        media_gallery_entries {
          label
          position
          disabled
          file
        }
        media_gallery {
          url
          label
        }
        custom_attributes(
          filter: [
            "brand_name"
            "sku"
            "UPC_GTIN"
            "weight"
            "tool_dimensions"
            "tool_grip_color"
            "tool_grip_material"
            "tool_material"
            "tool_additives"
            "packaging_dimensions"
            "packaging_material"
            "packaging_total_weight"
            "warranty_description"
            "disclosures"
            "barcode"
            "video_description"
            "images_description"
          ]
        ) {
          label
          code
          value
        }
        review_count
        rating_summary
        media_gallery {
          url
          label
          ... on ProductVideo {
            video_content {
              media_type
              video_provider
              video_url
              video_title
              video_description
              video_metadata
            }
          }
        }
        upsell_products {
          name
          sku
          stock_status
          url_key
          url_rewrites {
            url
            parameters {
              name
              value
            }
          }
          short_description {
            html
          }
          review_count
          rating_summary
          thumbnail {
            url
            label
          }
          image {
            url
            label
          }
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
        }
        mp_pre_order {
          stock_notice
          button_label
          children
          option_map
          is_preorder
        }
      }
    }
  }
`;

export const GET_PRODUCT_REVIEW_RATING = gql`
  query productReviewRatingsMetadata {
    productReviewRatingsMetadata {
      items {
        id
        name
        values {
          value_id
          value
        }
      }
    }
  }
`;

export const GET_CUSTOMER_REVIEW_TOKEN = gql`
  query {
    customer {
      reviews {
        items {
          average_rating
          ratings_breakdown {
            name
            value
          }
          nickname
          summary
          text
          product {
            name
            sku
            image {
              url
              label
            }
          }
          created_at
        }
      }
    }
  }
`;

export const CREATE_PRODUCT_REVIEW = gql`
  mutation CreateProductReview($input: CreateProductReviewInput!) {
    createProductReview(input: $input) {
      review {
        nickname
        summary
        text
        average_rating
        ratings_breakdown {
          name
          value
        }
      }
    }
  }
`;

// reviews queries

export const GET_PRODUCT_RATING_SUMMARY = gql`
  query GetProductRatingSummary($productId: Int!, $page: Int!) {
    advreview(productId: $productId, page: $page) {
      detailedSummary {
        one
        two
        three
        four
        five
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS_SETTINGS = gql`
  query GetProductReviewsSettings {
    amReviewSetting {
      isGDPREnabled
      getGDPRText
      isAllowImages
      isImagesRequired
      isCommentsEnabled
      isGuestCanComment
      isAllowHelpful
      isProsConsEnabled
      isSortingEnabled
      isFilteringEnabled
      perPage
      ratings {
        rating_id
        rating_code
        rating_options {
          option_id
          value
        }
      }
    }
  }
`;

export const ADD_ADVANCED_REVIEW = gql`
  mutation AddAdvReview($input: AddAdvReviewInput!) {
    addAdvReview(input: $input) {
      success
    }
  }
`;

export const GET_REVIEW_RATiNGS_METADATA = gql`
  query {
    productReviewRatingsMetadata {
      items {
        id
        name
        values {
          value_id
          value
        }
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS_BY_PAGE = gql`
  query GetProductReviewsByPage($productId: Int!, $page: Int!) {
    advreview(
      productId: $productId
      page: $page
      withImages: false
      withVideo: false
    ) {
      items {
        review_id
        created_at
        title
        detail
        nickname
        verified_buyer
        plus_review
        is_helpful
        customer_info {
          profile_pic
          country
        }
        rating_votes {
          rating_id
          value
          rating_code
        }
        video {
          full_path
          thumbnail_path
          video_duration
        }
        images {
          full_path
          resized_path
        }
        comments {
          message
          nickname
          created_at
        }
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS_WITH_VIDEOS = gql`
  query GetProductReviewsWithVideos($productId: Int!, $page: Int!) {
    advreview(
      productId: $productId
      page: $page
      withImages: false
      withVideo: true
    ) {
      items {
        review_id
        created_at
        title
        detail
        nickname
        verified_buyer
        plus_review
        is_helpful
        customer_info {
          profile_pic
          country
        }
        rating_votes {
          rating_id
          value
          rating_code
        }
        video {
          full_path
          thumbnail_path
          video_duration
        }
        images {
          full_path
          resized_path
        }
        comments {
          message
          nickname
          created_at
        }
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS_WITH_IMAGES = gql`
  query GetProductReviewsWithImages($productId: Int!, $page: Int!) {
    advreview(
      productId: $productId
      page: $page
      withImages: true
      withVideo: false
    ) {
      items {
        review_id
        created_at
        title
        detail
        nickname
        verified_buyer
        plus_review
        is_helpful
        customer_info {
          profile_pic
          country
        }
        rating_votes {
          rating_id
          value
          rating_code
        }
        video {
          full_path
          thumbnail_path
          video_duration
        }
        images {
          full_path
          resized_path
        }
        comments {
          message
          nickname
          created_at
        }
      }
    }
  }
`;

export const ADD_PRODUCT_REVIEW_COMMENT = gql`
  mutation AddProductReviewComment(
    $review_id: Int!
    $nickname: String!
    $email: String!
    $message: String!
  ) {
    addAdvComment(
      input: {
        review_id: $review_id
        nickname: $nickname
        email: $email
        message: $message
      }
    ) {
      success
      review {
        review_id
        comments {
          message
          nickname
          created_at
        }
      }
    }
  }
`;

export const UPDATE_PRODUCT_REVIEW_HELPFUL = gql`
  mutation SetUpdateProductReviewHelpful($review_id: Int!) {
    addAdvVote(input: { review_id: $review_id, type: "plus" }) {
      success
      review {
        review_id
        plus_review
        is_helpful
      }
    }
  }
`;
