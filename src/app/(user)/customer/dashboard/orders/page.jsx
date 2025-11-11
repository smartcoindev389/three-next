"use client";

import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import OrderHistoryList from "@/shared/components/(user)/OrderHistoryList/OrderHistoryList";
import { GET_CUSTOMER_DATA } from "@/lib/apollo/queryes/customer";
import Title from "@/shared/components/(common)/Title/Title";

/**
 * Component for fetching and displaying a list of orders with filters and pagination.
 * @example
 * Orders()
 * <div> ... </div>
 * @returns {JSX.Element} The rendered React component for the orders page.
 * @description
 *   - Utilizes GraphQL queries to fetch customer and order data based on date range and filters.
 *   - Provides state management for search, filter, pagination, and date range inputs.
 *   - Default date range is set to the full current year on mount.
 *   - Renders an `OrderHistoryList` component to display fetched order data.
 */
export default function Orders() {
  const { t, i18n } = useTranslation();
  const [customerData, setCustomerData] = useState();
  const [filterValue, setFilterValue] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const [rows, setRows] = useState(10);
  const [current, setCurrent] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setStartDate(getDateString(new Date(new Date().getFullYear(), 0, 1)));
    setEndDate(getDateString(new Date(new Date().getFullYear(), 11, 31)));
  }, []);

  const getDateString = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
  };

  const formatdate = (str, isStart) => {
    const timeFordate = isStart ? "00:00:00" : "23:59:59";
    const date = new Date(str);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day} ${timeFordate}`;
  };

  const getDateRange = (startDate, endDate) => {
    if (startDate && endDate) {
      const sDate = formatdate(startDate, 1);
      const eDate = formatdate(endDate, 0);

      return `from: "${sDate}", to: "${eDate}"`;
    }

    return "";
  };

  /**
   * Constructs a filter query based on filter and search values.
   * @example
   * constructFilter("All", "12345")
   * // returns 'filter: { number: { match: "12345" } }'
   * @param {string} filterValue - The status filter value, can be "All" or specific status.
   * @param {string} searchValue - The search string to match order numbers.
   * @returns {string} A filter query string to be used in fetching orders, or an empty string if no filters apply.
   * @description
   *   - Constructs different query strings based on the combination of filter and search inputs.
   *   - Returns an empty string if no filters or search values are applied.
   */
  const getFilterObject = (filterValue, searchValue) => {
    if (filterValue === "All" && !searchValue) {
      return "";
    }

    if (filterValue === "All" && searchValue) {
      return `filter: { number: { match: "${searchValue}" } }`;
    }

    if (filterValue !== "All" && searchValue) {
      return `filter: { number: { match: "${searchValue}" }, status: { in: [${filterValue}] } }`;
    }

    if (filterValue !== "All" && !searchValue) {
      return `filter: { status: { in: [${filterValue}] } }`;
    }

    return "";
  };

  const GET_ORDERS_DATA = gql`{
    ordersByDateRange(
      ${getDateRange(startDate, endDate)},
      ${getFilterObject(filterValue, searchValue)},
      sort: { sort_field: CREATED_AT, sort_direction: DESC },
      currentPage: ${current},
      pageSize: ${rows}) {
          total_count
          items {
              shipments {
                number
              }
              payment_methods
              carrier
              created_at
              grand_total
              id
              increment_id
              number
              order_date
              order_number
              shipping_method
              status
              order_currency_code
              billing_address
              billing_name
              stripe_payment {
                id
                icon
                label
              }
              shipbob_shipment {
                order_id
                id
                reference_id
                created_date
                status
                status_details {
                  id
                  name
                  description
                }
              }
              shipbob_shipment_time_line {
                log_type_id
                id
                log_type_name
                log_type_text
                timestamp
              }
          }
          page_info {
            current_page
            page_size
            total_pages
          }
    }
  }`;

  const { data } = useQuery(GET_CUSTOMER_DATA);
  const { loading: loadingOrders, data: ordersData } =
    useQuery(GET_ORDERS_DATA);

  useEffect(() => {
    setCustomerData(data?.customer);
    setTotalPages(ordersData?.ordersByDateRange?.page_info.total_pages);
  }, [data, ordersData]);

  return (
    <div className="w-full min-h-screen relative bg-[#F8F8FB] overflow-hidden tracking-[normal] text-left text-11xl text-black font-sf-pro-display">
      <div className="lg:bg-white lg:p-7 min-h-[70vh]">
        <Title className="text-paragraph pb-4 text-[1.75rem]">
          {t("Orders")}
        </Title>
        <OrderHistoryList
          current={current}
          endDate={endDate}
          filterValue={filterValue}
          loading={loadingOrders}
          orders={ordersData?.ordersByDateRange?.items}
          rows={rows}
          searchValue={searchValue}
          setCurrent={setCurrent}
          setEndDate={setEndDate}
          setFilterValue={setFilterValue}
          setRows={setRows}
          setSearchValue={setSearchValue}
          setStartDate={setStartDate}
          startDate={startDate}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
