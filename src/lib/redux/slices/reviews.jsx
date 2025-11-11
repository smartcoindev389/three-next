import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";

import { client } from "@/lib/apollo/client/client";
import {
  GET_PRODUCT_REVIEWS_SETTINGS,
  GET_PRODUCT_REVIEWS_BY_PAGE,
  GET_PRODUCT_REVIEWS_WITH_VIDEOS,
  GET_PRODUCT_REVIEWS_WITH_IMAGES,
} from "@/lib/apollo/queryes/product";

const fetchReviewsSettings = createAsyncThunk(
  "reviews/fetchReviewsSettings",
  async () => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCT_REVIEWS_SETTINGS,
        variables: {},
      });

      return data?.amReviewSetting;
    } catch (error) {
      throw error;
    }
  },
);

const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (variables) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCT_REVIEWS_BY_PAGE,
        variables: variables,
      });

      return {
        ...variables,
        option: "all",
        items: data?.advreview?.items || [],
      };
    } catch (error) {
      throw error;
    }
  },
);

const fetchImagesReviews = createAsyncThunk(
  "reviews/fetchImagesReviews",
  async (variables) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCT_REVIEWS_WITH_IMAGES,
        variables: variables,
      });

      return {
        ...variables,
        option: "images",
        items: data?.advreview?.items || [],
      };
    } catch (error) {
      throw error;
    }
  },
);

const fetchVideosReviews = createAsyncThunk(
  "reviews/fetchVideosReviews",
  async (variables) => {
    try {
      const { data } = await client.query({
        query: GET_PRODUCT_REVIEWS_WITH_VIDEOS,
        variables: variables,
      });

      return {
        ...variables,
        option: "videos",
        items: data?.advreview?.items || [],
      };
    } catch (error) {
      throw error;
    }
  },
);

const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (data, { rejectWithValue }) => {
    try {
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    settings: null,
    reviews: {},
    loading: {
      all: false,
      images: false,
      videos: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateReview.fulfilled, (state, action) => {
        if (action.payload) {
          const { product_id, review } = action.payload;

          Object.keys(state.reviews[product_id]).map((option) => {
            Object.keys(state.reviews[product_id][option]).forEach((page) => {
              const index = state.reviews[product_id][option][page].findIndex(
                (_review) => _review.review_id === review.review_id,
              );

              if (index !== -1) {
                state.reviews[product_id][option][page][index] = {
                  ...state.reviews[product_id][option][page][index],
                  ...review,
                };
              }

              return index;
            });

            return true;
          });
        }
      })
      .addCase(fetchReviewsSettings.fulfilled, (state, action) => {
        if (action.payload) {
          state.settings = action.payload;
        }
      })
      .addMatcher(
        isAnyOf(
          fetchReviews.pending,
          fetchImagesReviews.pending,
          fetchVideosReviews.pending,
        ),
        (state, action) => {
          let option;

          switch (action.type.split("/")[1]) {
            case "fetchReviews":
              option = "all";
              break;
            case "fetchImagesReviews":
              option = "images";
              break;
            case "fetchVideosReviews":
              option = "videos";
              break;
          }

          if (option) state.loading[option] = true;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchReviews.fulfilled,
          fetchImagesReviews.fulfilled,
          fetchVideosReviews.fulfilled,
        ),
        (state, action) => {
          const { productId, page, option, items } = action.payload;

          if (!state.reviews[productId]) state.reviews[productId] = {};

          if (!state.reviews[productId][option])
            state.reviews[productId][option] = {};

          state.reviews[productId][option][page] = items;
          state.loading[option] = false;
        },
      );
  },
});

export default reviewsSlice.reducer;

export {
  fetchReviewsSettings,
  fetchReviews,
  fetchImagesReviews,
  fetchVideosReviews,
  updateReview,
};
