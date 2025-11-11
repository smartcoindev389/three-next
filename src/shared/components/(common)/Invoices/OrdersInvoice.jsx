"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

import OrdersInvoiceDocument from "@/shared/components/(common)/PdfDocuments/OrdersInvoice";

/**
 * Renders a component to download an invoice as a PDF.
 * @example
 * renderInvoiceComponent(orderData, customerData)
 * <div className="invoice-component" ... />
 * @param {Object} orderData - Contains details of the order, including order number for PDF filename.
 * @param {Object} customerData - Contains customer information for the invoice.
 * @returns {JSX.Element} A JSX component with a download button for the invoice PDF.
 * @description
 *   - Utilizes `useTranslation` for localization of text within the component.
 *   - Includes a visually styled button for downloading the invoice.
 *   - The invoice PDF is generated dynamically using provided order and customer data.
 *   - Component visibility and rendering are expected behaviors.
 */
const OrdersInvoice = ({ orderData, customerData }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full 2xl:w-1/3 h-fit bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg w-full">
        <div className="flex items-center gap-4">
          <svg
            fill="none"
            height="48"
            viewBox="0 0 48 48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" fill="#9AE1FF" fillOpacity="0.43" r="24" />
            <path
              clipRule="evenodd"
              d="M24.186 25.552C23.569 25.552 23.209 26.139 23.209 26.925C23.209 27.716 23.58 28.275 24.192 28.275C24.809 28.275 25.163 27.687 25.163 26.901C25.163 26.175 24.815 25.552 24.186 25.552Z"
              fill="#00C0F3"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d="M26 13H18C16.896 13 16 13.896 16 15V31C16 32.104 16.896 33 18 33H30C31.104 33 32 32.104 32 31V19L26 13ZM21.155 28.454C20.729 28.808 20.082 28.975 19.291 28.975C18.816 28.975 18.481 28.945 18.253 28.915V24.944C18.589 24.89 19.026 24.861 19.488 24.861C20.256 24.861 20.754 24.999 21.143 25.293C21.563 25.605 21.827 26.103 21.827 26.815C21.827 27.59 21.545 28.124 21.155 28.454ZM24.145 29C22.945 29 22.244 28.094 22.244 26.942C22.244 25.731 23.017 24.826 24.211 24.826C25.452 24.826 26.13 25.755 26.13 26.871C26.129 28.196 25.325 29 24.145 29ZM28.8 28.238C29.075 28.238 29.381 28.177 29.562 28.106L29.7 28.819C29.532 28.903 29.154 28.993 28.663 28.993C27.266 28.993 26.546 28.124 26.546 26.972C26.546 25.593 27.529 24.826 28.753 24.826C29.227 24.826 29.586 24.922 29.748 25.006L29.562 25.732C29.375 25.654 29.118 25.582 28.794 25.582C28.068 25.582 27.504 26.02 27.504 26.92C27.504 27.729 27.984 28.238 28.8 28.238ZM26 20C25.447 20 25 20 25 20V15L30 20H26Z"
              fill="#00C0F3"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d="M19.5839 25.563C19.3809 25.563 19.2489 25.581 19.1709 25.599V28.244C19.2489 28.262 19.3749 28.262 19.4879 28.262C20.3159 28.268 20.8549 27.813 20.8549 26.847C20.8609 26.007 20.3699 25.563 19.5839 25.563Z"
              fill="#00C0F3"
              fillRule="evenodd"
            />
          </svg>
          <div>
            <div className="text-[#495057] text-xl">
              {t("Download Receipt")}
            </div>
          </div>
        </div>
        <button className='rounded-full inline-flex items-center justify-center p-2 text-center text-base font-medium text-primary hover:bg-blue-light-5 hover:text-body-color disabled:bg-gray-3 active:bg-blue-light-3 disabled:border-gray-3">'>
          <PDFDownloadLink
            document={
              <OrdersInvoiceDocument custData={customerData} data={orderData} />
            }
            fileName={`invoice-${orderData?.number}.pdf`}
          >
            <svg
              fill="none"
              height="30"
              viewBox="0 0 30 30"
              width="30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6801_227)">
                <path
                  d="M14.5029 21.825C14.5345 21.8563 14.5691 21.8846 14.606 21.9094L14.6623 21.9398C14.7045 21.9669 14.7514 21.986 14.8006 21.9961L14.8591 22.0125C14.9489 22.0302 15.0413 22.0302 15.131 22.0125L15.192 21.9937L15.2623 21.9727C15.2864 21.9615 15.3099 21.949 15.3326 21.9352L15.3818 21.907C15.4206 21.881 15.4567 21.8512 15.4896 21.818L21.7966 15.518C21.8753 15.4567 21.9401 15.3795 21.9866 15.2913C22.0332 15.2032 22.0604 15.1062 22.0666 15.0067C22.0728 14.9072 22.0578 14.8075 22.0225 14.7143C21.9872 14.621 21.9325 14.5364 21.862 14.4659C21.7915 14.3954 21.7069 14.3407 21.6136 14.3054C21.5204 14.2701 21.4207 14.2551 21.3212 14.2613C21.2217 14.2675 21.1247 14.2947 21.0365 14.3413C20.9484 14.3878 20.8712 14.4526 20.8099 14.5312L15.7029 19.6312V0.703125C15.7029 0.516645 15.6288 0.337802 15.497 0.205941C15.3651 0.074079 15.1863 0 14.9998 0C14.8133 0 14.6345 0.074079 14.5026 0.205941C14.3707 0.337802 14.2966 0.516645 14.2966 0.703125V19.6312L9.18962 14.5312C9.05434 14.426 8.88528 14.3738 8.7142 14.3844C8.54313 14.395 8.38183 14.4678 8.26063 14.589C8.13943 14.7102 8.06667 14.8715 8.05604 15.0426C8.04541 15.2136 8.09764 15.3827 8.2029 15.518L14.5029 21.825Z"
                  fill="#495057"
                />
                <path
                  d="M29.2969 20.625C29.1104 20.625 28.9316 20.6991 28.7997 20.8309C28.6678 20.9628 28.5938 21.1416 28.5938 21.3281V26.4844C28.5938 27.0438 28.3715 27.5803 27.9759 27.9759C27.5803 28.3715 27.0438 28.5938 26.4844 28.5938H3.51562C2.95618 28.5938 2.41966 28.3715 2.02407 27.9759C1.62849 27.5803 1.40625 27.0438 1.40625 26.4844V21.3281C1.40625 21.1416 1.33217 20.9628 1.20031 20.8309C1.06845 20.6991 0.889605 20.625 0.703125 20.625C0.516645 20.625 0.337802 20.6991 0.205941 20.8309C0.074079 20.9628 0 21.1416 0 21.3281L0 26.4844C0 27.4168 0.370395 28.311 1.0297 28.9703C1.68901 29.6296 2.58322 30 3.51562 30H26.4844C27.4168 30 28.311 29.6296 28.9703 28.9703C29.6296 28.311 30 27.4168 30 26.4844V21.3281C30 21.1416 29.9259 20.9628 29.7941 20.8309C29.6622 20.6991 29.4834 20.625 29.2969 20.625Z"
                  fill="#495057"
                />
              </g>
              <defs>
                <clipPath id="clip0_6801_227">
                  <rect fill="white" height="30" width="30" />
                </clipPath>
              </defs>
            </svg>
          </PDFDownloadLink>
        </button>
      </div>
    </div>
  );
};

export default OrdersInvoice;
