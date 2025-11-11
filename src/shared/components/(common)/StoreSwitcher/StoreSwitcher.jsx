"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import { GEO_IP_REQUEST } from "@/lib/apollo/queryes/geoIp";
import { AVAILABLE_STORES_REQUEST } from "@/lib/apollo/queryes/availableStores";
import "@/i18n/i18n";
import StaggeredDropDown from "@/shared/components/(common)/Dropdown/Dropdown";
import { fetchCurrency } from "@/lib/redux/slices/Currency";

const StoreSwitcher = ({ className }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");
  const geoIp = useQuery(GEO_IP_REQUEST);
  const availableStores = useQuery(AVAILABLE_STORES_REQUEST);
  const [storeList, setStoreList] = useState([]);
  const [open, setOpen] = useState(false);
  const getLanguage = useCallback(() => {
    const item = storeList.find((item) => {
      return item.code === getLangCode();
    });

    return item ? item.name : "United States";
  }, [storeList]);
  const getLangCode = () => {
    const selectedLang = localStorage.getItem("lang");

    if (!selectedLang || selectedLang === "undefined") {
      return "en_US";
    }

    return selectedLang;
  };
  const handleLanguageSwitcher = useCallback(
    (value) => {
      localStorage?.removeItem("currency");
      dispatch(fetchCurrency());
      localStorage?.setItem("lang", value);
      i18n.changeLanguage(value.split("_").join("-"));
      setLang(getLanguage());
    },
    [i18n, dispatch, getLanguage],
  );

  useEffect(() => {
    if (storeList.length) {
      setLang(getLanguage());
    }
  }, [getLanguage, storeList]);
  useEffect(() => {
    const lang =
      localStorage?.getItem("lang") ??
      geoIp?.data?.getIpInfo.store_code ??
      "en_US";

    if (localStorage.getItem("lang") !== lang) {
      handleLanguageSwitcher(lang);
    }
  }, [geoIp, handleLanguageSwitcher]);

  useEffect(() => {
    if (
      availableStores !== undefined &&
      availableStores?.data?.availableStores
    ) {
      const storeListFormatted = [];

      (availableStores?.data?.availableStores ?? []).forEach(function (store) {
        //ignore default store view

        if (store.store_code === "default") {
          return;
        }
        const flagIconName =
          "/assets/icons/" +
          store.store_code.split("_")[1]?.toLowerCase() +
          ".svg";

        storeListFormatted.push({
          code: store.store_code,
          name: store.store_name,
          icon: flagIconName,
        });
      });
      if (!storeList.length) {
        setStoreList(storeListFormatted);
      }
    }
  }, [availableStores, storeList]);

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
        data={storeList}
        open={open}
        setOpen={(value) => {
          setOpen(value);
        }}
        value={lang}
        onSelect={handleLanguageSwitcher}
      />
    </motion.div>
  );
};

export default StoreSwitcher;
