import { useCallback, useEffect, useState } from "react";
import "@/i18n/i18n";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import StaggeredDropDown from "@/shared/components/(common)/Dropdown/Dropdown";
import { setCurrency, fetchCurrency } from "@/lib/redux/slices/Currency";

const CurrencySwitcher = ({ className }) => {
  const getSessionCurrency = () => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage?.getItem("currency");
    } catch (e) {
      return null;
    }
  };
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedCurrency = getSessionCurrency();
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCurrency());
  }, [dispatch]);

  const selectCurrency = useCallback(
    (value) => {
      setSelectedCurrency(value);
      dispatch(setCurrency(value));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!mounted) return;
    
    if (currency !== undefined && currency.availableCurrencies.length > 0) {
      const currenciesList = [];

      (currency.availableCurrencies ?? []).forEach(function (currencyCode) {
        currenciesList.push({
          code: currencyCode,
          name: `${currencyCode} (${getCurrencySymbol(currencyCode)})`,
        });
      });
      if (currenciesList.length > 0) {
        setCurrencyList(currenciesList);
      }
      const storedCurrency = getSessionCurrency();
      const currencySelectedInList = currenciesList.find((item) => {
        return item.code === storedCurrency;
      });

      if (!currencySelectedInList && currenciesList.length > 0) {
        selectCurrency(currenciesList[0].code);
      } else if (storedCurrency) {
        selectCurrency(storedCurrency);
      } else if (currenciesList.length > 0) {
        selectCurrency(currenciesList[0].code);
      }
    }
  }, [currency, mounted]);

  const handleCurrencySwitcher = (value) => {
    selectCurrency(value);
  };

  function getCurrencySymbol(currencyCode) {
    return (0)
      .toLocaleString("en", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, "")
      .trim();
  }

  if (!mounted || !selectedCurrency || currencyList.length === 0) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 0, y: -12 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-indigo-500">
          <span className="font-medium text-sm">USD</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 1.5, duration: 0.5, ease: "easeInOut" },
      }}
      className={className}
      exit={{ opacity: 0, y: -12 }}
      initial={{ opacity: 0, y: -12 }}
    >
      <StaggeredDropDown
        data={currencyList}
        open={open}
        setOpen={(value) => {
          setOpen(value);
        }}
        value={selectedCurrency}
        onSelect={handleCurrencySwitcher}
      />
    </motion.div>
  );
};

export default CurrencySwitcher;
