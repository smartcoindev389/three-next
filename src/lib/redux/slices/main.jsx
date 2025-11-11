import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { strapi } from "@/lib/strapi/strapi";

export const setLoadingStatus = createAsyncThunk(
  "main/setLoading",
  async (status, { rejectWithValue }) => {
    try {
      return status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const setLadingPageData = createAsyncThunk(
  "main/setData",
  async (state, { rejectWithValue }) => {
    try {
      const header = await strapi.getPageHeader();
      const main = await strapi.getPageHomePage();
      const footer = await strapi.getPageFooter();

      return {
        header: header.data,
        main: main.data,
        footer: footer.data,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  loaded: false,
  loading: false,
  status: "",
  data: {},
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setLoadingStatus.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.loaded = false;
      })
      .addCase(setLoadingStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loaded = action.payload;
        state.loading = false;
      })
      .addCase(setLadingPageData.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default mainSlice.reducer;
