import { combineReducers, configureStore } from "@reduxjs/toolkit";

import currencySlice from "@/lib/redux/slices/Currency";
import mainSlice from "@/lib/redux/slices/main";
import checkoutSlice from "@/lib/redux/slices/checkout";
import reviewsSlice from "@/lib/redux/slices/reviews";

const rootReducer = combineReducers({
  currency: currencySlice,
  main: mainSlice,
  checkout: checkoutSlice,
  reviews: reviewsSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
