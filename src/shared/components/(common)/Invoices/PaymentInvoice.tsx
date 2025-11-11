import { useState, useEffect, PropsWithChildren, FC } from "react";
import { useQuery } from "@apollo/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

import PaymentInvoiceDocument from "@/shared/components/(common)/PdfDocuments/PaymentInvoice";
import { GET_CUSTOMER_PAYMENT_DATA } from "@/lib/apollo/queryes/customer";

const ButtonWrapper: FC<PropsWithChildren<{ className: string }>> = ({
  children,
  className,
}) => {
  return (
    <button
      className={`text-sm font-medium text-white bg-blue rounded-[50px] flex items-center justify-center px-3 py-1 gap-1 mx-auto ${className}`}
    >
      <svg
        fill="none"
        height="14"
        viewBox="0 0 14 14"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.53259 10.9715C6.46421 10.9713 6.39664 10.9567 6.33426 10.9287C6.27187 10.9007 6.21608 10.8599 6.1705 10.8089L1.60951 5.75096C1.54684 5.68089 1.50576 5.5942 1.49122 5.50132C1.47668 5.40844 1.4893 5.31334 1.52757 5.22747C1.56583 5.1416 1.6281 5.06863 1.70688 5.01733C1.78566 4.96604 1.8776 4.93861 1.9716 4.93836H3.79801V0.487563C3.79801 0.358253 3.84938 0.23424 3.94082 0.142804C4.03225 0.0513681 4.15627 0 4.28558 0H8.7809C8.91021 0 9.03423 0.0513681 9.12566 0.142804C9.2171 0.23424 9.26847 0.358253 9.26847 0.487563V4.93706H11.0939C11.1879 4.93731 11.2798 4.96474 11.3586 5.01603C11.4374 5.06733 11.4997 5.1403 11.5379 5.22617C11.5762 5.31204 11.5888 5.40714 11.5743 5.50002C11.5598 5.5929 11.5187 5.67959 11.456 5.74966L6.89469 10.8102C6.84899 10.861 6.79314 10.9015 6.73076 10.9293C6.66839 10.9571 6.60087 10.9714 6.53259 10.9715ZM3.06765 5.91219L6.53259 9.75581L9.99786 5.91219H8.7809C8.6516 5.91219 8.52758 5.86082 8.43615 5.76938C8.34471 5.67795 8.29334 5.55393 8.29334 5.42462V0.975125H4.77314V5.42462C4.77314 5.55393 4.72177 5.67795 4.63034 5.76938C4.5389 5.86082 4.41489 5.91219 4.28558 5.91219H3.06765Z"
          fill="currentColor"
        />
        <path
          d="M10.9445 14.0001H2.12252C1.55984 13.9995 1.02036 13.7757 0.622452 13.3779C0.224542 12.98 0.000688296 12.4406 0 11.8779V10.6372C0 10.5079 0.0513681 10.3839 0.142804 10.2925C0.23424 10.201 0.358253 10.1497 0.487563 10.1497C0.616872 10.1497 0.740886 10.201 0.832322 10.2925C0.923757 10.3839 0.975125 10.5079 0.975125 10.6372V11.8779C0.975555 12.1821 1.09659 12.4736 1.31169 12.6886C1.52678 12.9037 1.81838 13.0246 2.12252 13.025H10.9445C11.2486 13.0246 11.5402 12.9037 11.7552 12.6886C11.9702 12.4736 12.0912 12.182 12.0916 11.8779V10.6372C12.0916 10.5079 12.1429 10.3839 12.2344 10.2925C12.3258 10.201 12.4498 10.1497 12.5791 10.1497C12.7084 10.1497 12.8324 10.201 12.9239 10.2925C13.0153 10.3839 13.0667 10.5079 13.0667 10.6372V11.8779C13.066 12.4405 12.8422 12.9799 12.4443 13.3778C12.0465 13.7756 11.5071 13.9994 10.9445 14.0001Z"
          fill="currentColor"
        />
      </svg>
      {children}
    </button>
  );
};

interface PaymentInvoiceProps {
  orderId: string;
  className?: string;
}

const PaymentInvoice: FC<PropsWithChildren<PaymentInvoiceProps>> = ({
  orderId,
  children,
  className = "",
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState(undefined);
  const { loading, data: orderData } = useQuery(GET_CUSTOMER_PAYMENT_DATA, {
    variables: { orderId },
  });

  useEffect(() => {
    setData(orderData?.customer.orders.items[0]);
  }, [orderData, orderId]);

  if (loading)
    return (
      <ButtonWrapper className={className}>{t("Loading...")}</ButtonWrapper>
    );

  return (
    <PDFDownloadLink
      document={<PaymentInvoiceDocument data={data} />}
      fileName={`invoice-${orderId}.pdf`}
    >
      <ButtonWrapper className={className}>
        {children ? children : t("Download")}
      </ButtonWrapper>
    </PDFDownloadLink>
  );
};

export default PaymentInvoice;
