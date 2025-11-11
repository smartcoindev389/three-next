"use client";

import { useTranslation } from "react-i18next";
import { FC } from "react";

import { headers } from "../headers";

import TableBody from "./TableBody";

import { Order } from "@/types/types";

interface OrderTableProps {
  data: Order[];
  shortView: boolean;
  className?: string;
}

const OrderTable: FC<OrderTableProps> = ({
  data,
  shortView,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <table
      className={`w-full table-auto bg-white shadow border-stroke ${shortView ? "" : "border"} ${className}`}
    >
      <thead>
        <tr className="text-left">
          {headers.map((header) => {
            const shouldShowInShortView = shortView ? header.shortView : true;

            return (
              shouldShowInShortView && (
                <th
                  key={header.name}
                  className={`text-nowrap text-darkslategray-200 py-4 px-5 first:pl-5 text-base font-semibold border-r last:border-r-0 border-stroke ${shortView ? "" : header.styles}`}
                >
                  {t(header.name)}
                </th>
              )
            );
          })}
        </tr>
      </thead>
      <TableBody data={data} shortView={shortView} />
    </table>
  );
};

export default OrderTable;
