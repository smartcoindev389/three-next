"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrency } from "@/lib/redux/slices/Currency";

const Price = (props) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const { amount = 0, storeCurrency = null, orderCurrency = null } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrency());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedCurrency(localStorage.getItem("currency") || "USD");
    }
  }, []);

  const currency = useSelector((state) => state.currency);
  const baseCurrencyRate =
    currency.exchangeRates.find(
      ({ currency_to }) => currency_to === selectedCurrency,
    )?.rate || 1;
  let rate =
    currency.exchangeRates.find(
      ({ currency_to }) => currency_to === currency.storeCurrency,
    )?.rate || 1;

  if (storeCurrency) {
    rate = rate / baseCurrencyRate;
  } else {
    rate = 1;
  }
  if (currency.storeCurrency === selectedCurrency) {
    rate = 1;
  }

  let _currency = "USD";

  if (typeof window !== "undefined") {
    const storedCurrency = localStorage.getItem("currency");

    _currency = storedCurrency || storeCurrency || "USD";
  } else if (storeCurrency) {
    _currency = storeCurrency;
  }

  if (orderCurrency) {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: orderCurrency,
      currencyDisplay: "symbol",
    }).format(amount);

    return <span className={props.className}>{formattedPrice}</span>;
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: _currency,
    currencyDisplay: "symbol",
  }).format(amount * rate);

  return <span className={props.className}>{formattedPrice}</span>;
};

export default Price;
