import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { client } from "@/lib/apollo/client/client";
import { COUNTRIES } from "@/lib/apollo/queryes/others";

const fetchCountries = createAsyncThunk("checkout/fetchCountries", async () => {
  const { data } = await client.query({
    query: COUNTRIES,
    variables: {},
  });

  return data.countries || [];
});

const changeRequestLoading = createAsyncThunk(
  "checkout/changeRequestLoading",
  async (isLoading, { rejectWithValue }) => {
    try {
      return isLoading;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    requestLoading: false,
    countries: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.fulfilled, (state, action) => {
        if (action.payload) {
          const countries = action.payload,
            unitedStatesEntry = countries.find(
              (item) => item.full_name_english === "United States",
            ),
            filteredCountries = countries.filter(
              (item) =>
                item.full_name_english !== "---select---" &&
                item.full_name_english !== "United States",
            ),
            sortedEntries = filteredCountries.sort((a, b) => {
              if (a.full_name_english < b.full_name_english) {
                return -1;
              }
              if (a.full_name_english > b.full_name_english) {
                return 1;
              }

              return 0;
            });

          state.countries = [
            { value: "", full_name_english: "Country" },
            unitedStatesEntry,
            ...sortedEntries,
          ];
        }
      })
      .addCase(changeRequestLoading.fulfilled, (state, action) => {
        state.requestLoading = action.payload;
      });
  },
});

export default checkoutSlice.reducer;

export { fetchCountries, changeRequestLoading };
