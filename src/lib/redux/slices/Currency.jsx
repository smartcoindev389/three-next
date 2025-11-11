"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";

import { client } from "@/lib/apollo/client/client";

const GET_CURRENCIES = gql`
  {
    currency {
      base_currency_code
      base_currency_symbol
      default_display_currency_code
      default_display_currency_symbol
      available_currency_codes
      exchange_rates {
        currency_to
        rate
      }
    }
  }
`;
const fetchCurrency = createAsyncThunk(
  "currency/fetchCurrency",
  async (_, { dispatch }) => {
    try {
      const { data } = await client.query({
        query: GET_CURRENCIES,
        fetchPolicy: "no-cache",
      });

      return data.currency;
    } catch (error) {
      throw error;
    }
  },
);

const initialState = {
  storeCurrency: null,
  baseCurrency: null,
  availableCurrencies: [],
  exchangeRates: [],
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.storeCurrency = action.payload;
      localStorage.setItem("currency", state.storeCurrency);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrency.fulfilled, (state, action) => {
      const {
        default_display_currency_code,
        base_currency_code,
        available_currency_codes,
        exchange_rates,
      } = action.payload;

      state.baseCurrency = base_currency_code;
      state.availableCurrencies = available_currency_codes;
      state.exchangeRates = exchange_rates;
      const t = localStorage.getItem("currency");

      state.storeCurrency =
        t && available_currency_codes.includes(t)
          ? t
          : default_display_currency_code;
      localStorage.setItem("currency", state.storeCurrency);
    });
  },
});
export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
export { fetchCurrency };
