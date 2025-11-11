"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function GetCustomAtrribute({ custData, code }) {
  return custData?.customer?.custom_attributes?.find((item) => item.code === code)?.value;
}

export const getCustomerCustomAttribute = (customer, code) => {
  return customer?.custom_attributes?.find((item) => item.code === code)?.value;
};

export const startResendTimer = (setResendDisabled, setResendTimer) => {
  setResendDisabled(true);
  let count = 19;

  setResendTimer(count);

  const timer = setInterval(() => {
    count -= 1;
    setResendTimer(count);
    if (count === 0) {
      clearInterval(timer);
      setResendDisabled(false);
    }
  }, 1000);
};

export const resetResendTimer = (setResendDisabled, resendTimer, setResendTimer) => {
  clearInterval(resendTimer);
  setResendDisabled(false);
  setResendTimer(0);
};

export const saveRoutePath = (value) => {
  localStorage.setItem("auth_refer", value);
};

export const getRoutePath = () => {
  const path = localStorage.getItem("auth_refer");

  return path || "";
};

export const getFormData = (event) => {
  const formData = new FormData(event.target);

  return Object.fromEntries(formData.entries());
};
