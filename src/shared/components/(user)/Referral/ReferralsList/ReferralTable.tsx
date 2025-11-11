import { format } from "date-fns";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import ReferralStatus from "@/shared/components/(user)/Referral/ReferralsList/ReferralStatus";
import { Referral } from "@/types/referral";

interface ReferralTableProps {
  data: Referral[];
}

const ReferralTable: FC<ReferralTableProps> = ({ data = [] }) => {
  const { t } = useTranslation();

  return (
    <table className="w-full table-fixed text-center max-lg:min-w-[600px]">
      <thead className="border-b-[1px] border-b-[#E0E0E0]">
        <tr className="md:text-lg">
          <th className="font-semibold relative pl-6 py-4 text-left leading-none border-r-[1px] border-r-[#E0E0E0]">
            {t("Name")}
          </th>
          <th className="font-semibold relative py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
            {t("Click Source")}
          </th>
          <th className="font-semibold relative py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
            {t("Country / IP")}
          </th>
          <th className="font-semibold relative py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
            {t("Date")}
          </th>
          <th
            hidden
            className="font-semibold relative py-4 leading-none border-r-[1px] border-r-[#E0E0E0]"
          >
            {t("Link Shared On")}
          </th>
          <th className="font-semibold relative py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
            {t("Purchase Status")}
          </th>
          <th className="font-semibold relative py-4 leading-none">
            {t("Purchase Amount")}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr
            key={`${item.created_at}-${i}`}
            className="font-normal border-b-[#E0E0E0] bg-white"
          >
            <td className="pl-6 py-4 text-left leading-none border-r-[1px] border-r-[#E0E0E0]">
              {item.customer_name === "" ? "GUEST" : item.customer_name}
            </td>
            <td className="py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
              {item.referral_host}
            </td>
            <td className="py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
              {item.ip_address}
            </td>
            <td className="py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
              {format(item.created_at, "MM/dd/yyyy")}
            </td>
            <td
              hidden
              className="py-4 leading-none border-r-[1px] border-r-[#E0E0E0]"
            >
              {item.referral_host ?? ""}
            </td>
            <td className="py-4 leading-none border-r-[1px] border-r-[#E0E0E0]">
              <ReferralStatus isComplete={item.is_complete} />
            </td>
            <td className="py-4 leading-none">{item.purchase_amount ?? "0"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReferralTable;
