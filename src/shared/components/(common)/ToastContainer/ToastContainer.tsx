"use client";

import { ToastContainer as ToastifyContainer, Slide, ToastIcon } from "react-toastify";
import { FC } from "react";

import SuccessIcon from "@/assets/icons/inline-svg/success.svg";
import ErrorIcon from "@/assets/icons/inline-svg/error.svg";
import AlertIcon from "@/assets/icons/inline-svg/alert.svg";
import InfoIcon from "@/assets/icons/inline-svg/info.svg";

const getIcon: ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon className="text-red-500" />;
    case "warning":
      return <AlertIcon />;
    case "info":
      return <InfoIcon className="text-slategray-400" />;
    default:
      return null;
  }
};

const ToastContainer: FC = () => {
  return (
    <ToastifyContainer
      closeOnClick
      hideProgressBar
      newestOnTop
      pauseOnHover
      autoClose={10000}
      icon={getIcon}
      limit={3}
      position="top-right"
      transition={Slide}
    />
  );
};

export default ToastContainer;
