"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/(common)/ui/select";
import { cn } from "@/utils/utils-old";
import { Button } from "@/shared/components/(common)/ui/button";
import { Calendar } from "@/shared/components/(common)/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/(common)/ui/popover";
import OrdersList from "@/shared/components/(user)/Order/OrdersList";
import useMobile from "@/hooks/useMobile";

/**
 * Renders an order history list with filters and pagination controls.
 * @example
 * OrderHistoryList({ orders: [], setFilterValue: () => {}, filterValue: 'All', loading: false, searchValue: '', setSearchValue: () => {}, rows: 10, setRows: () => {}, current: 1, setCurrent: () => {}, startDate: null, setStartDate: () => {}, endDate: null, setEndDate: () => {}, totalPages: 5 })
 * Returns a rendered list of orders with filtering and pagination.
 * @param {Object} params - Parameters for the component.
 * @param {Array} params.orders - List of orders to be displayed.
 * @param {Function} params.setFilterValue - Function to set the filter value.
 * @param {String} params.filterValue - Current filter value.
 * @param {Boolean} params.loading - Indicates if data is loading.
 * @param {String} params.searchValue - Current search input value.
 * @param {Function} params.setSearchValue - Function to update the search input value.
 * @param {Number} params.rows - Number of rows to be displayed per page.
 * @param {Function} params.setRows - Function to set the number of rows.
 * @param {Number} params.current - Current page number.
 * @param {Function} params.setCurrent - Function to set the current page number.
 * @param {Date|null} params.startDate - Start date for date filter.
 * @param {Function} params.setStartDate - Function to set the start date.
 * @param {Date|null} params.endDate - End date for date filter.
 * @param {Function} params.setEndDate - Function to set the end date.
 * @param {Number} params.totalPages - Total number of pages available for pagination.
 * @returns {JSX.Element} Returns the rendered order history list component.
 * @description
 *   - Implements filter options including 'Delivered' and 'Cancelled'.
 *   - Provides date range selection using popover calendar components.
 *   - Supports search input for filtering displayed orders.
 *   - Handles pagination with previous and next controls and a maximum of five displayed pages.
 */
const OrderHistoryList = ({
  orders,
  setFilterValue,
  filterValue,
  loading,
  searchValue,
  setSearchValue,
  rows,
  setRows,
  current,
  setCurrent,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  totalPages,
}) => {
  const isMobile = useMobile();

  const filterListOptions = [
    { title: "All", value: "All" },
    { title: "Delivered", value: "Delivered" },
    { title: "Cancelled", value: "Canceled" },
  ];

  const handleEndDateSelect = (date) => {
    setEndDate(date);
    setCurrent(1);
  };

  const handleStartDateSelect = (date) => {
    setStartDate(date);
    setCurrent(1);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setCurrent(1);
  };

  const changeFilter = (value) => {
    setFilterValue(value);
    setCurrent(1);
    setSearchValue("");
  };

  const handleRowChange = (value) => {
    setRows(value);
    setCurrent(1);
  };

  const decrease = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };

  const increase = () => {
    if (current < totalPages) {
      setCurrent(current + 1);
    }
  };

  const maxPageDisplay = 5;

  /**
   * Calculates the array of page numbers to be displayed based on the current page and total pages.
   * @example
   * generatePageNumbers(10, 5)
   * // returns [3, 4, 5, 6, 7]
   * @param {number} totalPages - Total number of pages available.
   * @param {number} currentPage - The current page number.
   * @returns {Array<number>} Array of page numbers to be displayed.
   * @description
   *   - Uses a maximum number of pages to decide the range of page numbers to display.
   *   - Adjusts the range to keep the current page in the center as much as possible.
   *   - Handles edge cases when the current page is near the start or end of the total pages.
   */
  const createPageList = (totalPages, currentPage) => {
    let startPage, endPage;

    if (totalPages <= maxPageDisplay) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= Math.ceil(maxPageDisplay / 2)) {
      startPage = 1;
      endPage = maxPageDisplay;
    } else if (currentPage + Math.floor(maxPageDisplay / 2) >= totalPages) {
      startPage = totalPages - maxPageDisplay + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxPageDisplay / 2);
      endPage = currentPage + Math.floor(maxPageDisplay / 2);
    }
    const pages = [];

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="">
      <div className="rounded">
        <div className="flex flex-row-reverse justify-between lg:block max-lg:border-b pb-1">
          <div className="flex justify-end gap-1 md:gap-3 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "md:w-[200px] justify-between text-left font-normal text-slategray-400 max-md:pr-2 max-md:pl-3 gap-2",
                    !startDate && "text-muted-foreground",
                  )}
                  variant="outline"
                >
                  {startDate ? (
                    format(startDate, "MM-dd-yyyy")
                  ) : (
                    <span>Pick start date</span>
                  )}
                  <CalendarIcon className="sm:mr-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                />
              </PopoverContent>
            </Popover>
            <span className="text-[#74788D] text-[13px] font-semibold">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "md:w-[200px] justify-between text-left font-normal text-slategray-400 max-md:pr-2 max-md:pl-3 gap-2",
                    !endDate && "text-muted-foreground",
                  )}
                  variant="outline"
                >
                  {endDate ? (
                    format(endDate, "MM-dd-yyyy")
                  ) : (
                    <span>Pick end date</span>
                  )}
                  <CalendarIcon className="sm:mr-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="border-b-[2px] border-solid border-[#f6f6f6] flex mt-2 sm:mt-0">
            {isMobile ? (
              <Select
                className=""
                value={filterValue}
                onValueChange={(v) => changeFilter(v)}
              >
                <SelectTrigger className="!pl-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="">
                  {filterListOptions?.map(({ value, title }) => (
                    <SelectItem key={value} value={value}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              filterListOptions?.map((val, index) => (
                <button
                  key={index}
                  className={`px-[16px] pb-[9px] text-[.8125rem] leading-normal cursor-pointer ${
                    val?.value === filterValue
                      ? "text-blue border-b-[2px] border-solid border-blue mb-[-2px]"
                      : "text-slategray-400"
                  }`}
                  type="button"
                  onClick={(e) => changeFilter(val?.value)}
                >
                  {" "}
                  {val?.title}{" "}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex items-center max-lg:justify-between w-full py-5">
          <div className="max-md:order-2 flex items-center">
            <div className="text-[13px] text-[#495057] max-xs:hidden">Show</div>
            <Select value={rows} onValueChange={handleRowChange}>
              <SelectTrigger className="bg-white w-20 border border-solid border-[#CED4DA] rounded-sm pl-3 pr-0 py-0 ml-2 h-7">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent className="rounded-sm w-20">
                <SelectItem value={5}>5</SelectItem>
                <SelectItem value={10}>10</SelectItem>
                <SelectItem value={20}>20</SelectItem>
                <SelectItem value={50}>50</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-[#495057] text-[13px] ml-[5px]">entries</div>
          </div>
          <div className="relative w-full max-w-[170px] lg:max-w-[250px] lg:flex lg:ml-12 lg:mr-11">
            <input
              className="max-md:py-0 max-md:h-8 h-9 w-full rounded-[30px] border border-solid border-[#CED4DA] bg-white pl-10 pr-4 text-sm font-medium text-[#74788D] outline-none focus:border-white"
              placeholder="Search..."
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#74788D]">
              <svg
                className="fill-current"
                fill="none"
                height="14"
                viewBox="0 0 15 14"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    clipRule="evenodd"
                    d="M7.05203 2.33332C4.79687 2.33332 2.9687 4.16149 2.9687 6.41666C2.9687 8.67182 4.79687 10.5 7.05203 10.5C9.3072 10.5 11.1354 8.67182 11.1354 6.41666C11.1354 4.16149 9.3072 2.33332 7.05203 2.33332ZM1.80203 6.41666C1.80203 3.51716 4.15254 1.16666 7.05203 1.16666C9.95153 1.16666 12.302 3.51716 12.302 6.41666C12.302 9.31615 9.95153 11.6667 7.05203 11.6667C4.15254 11.6667 1.80203 9.31615 1.80203 6.41666Z"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M9.93538 9.3C10.1632 9.0722 10.5325 9.0722 10.7603 9.3L13.2978 11.8375C13.5256 12.0653 13.5256 12.4347 13.2978 12.6625C13.07 12.8903 12.7007 12.8903 12.4729 12.6625L9.93538 10.125C9.70757 9.89716 9.70757 9.52781 9.93538 9.3Z"
                    fillRule="evenodd"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <OrdersList loading={loading} orders={orders} />
          <div
            className={`py-[30px] text-center ${totalPages > 1 ? "block" : "hidden"} !block`}
          >
            <ul className="inline-flex items-center justify-center rounded-[50px] border border-stroke bg-white overflow-hidden">
              <li>
                <button
                  className="flex h-[36px] items-center justify-center border border-transparent px-[15px] text-base font-medium text-dark hover:bg-gray-2"
                  onClick={decrease}
                >
                  <svg
                    fill="none"
                    height="12"
                    viewBox="0 0 7 12"
                    width="7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.99981 12C5.94067 12 5.88211 11.9884 5.82747 11.9658C5.77283 11.9432 5.72318 11.91 5.68135 11.8682L0.131821 6.31841C0.0474156 6.23398 -5.34982e-07 6.11948 -5.24545e-07 6.00009C-5.14108e-07 5.88071 0.0474157 5.76621 0.131821 5.68178L5.68135 0.131956C5.72315 0.0901348 5.77278 0.0569566 5.8274 0.0343157C5.88203 0.0116748 5.94057 1.44691e-05 5.9997 5.3702e-07C6.05883 -1.33951e-05 6.11739 0.0116194 6.17202 0.0342346C6.22666 0.0568497 6.2763 0.0900046 6.31812 0.131806C6.35994 0.173607 6.39312 0.223236 6.41576 0.27786C6.4384 0.332484 6.45006 0.391032 6.45008 0.450162C6.45009 0.509292 6.43846 0.567846 6.41584 0.62248C6.39323 0.677114 6.36007 0.726759 6.31827 0.76858L1.08691 5.99994L6.31827 11.2313C6.38128 11.2943 6.42419 11.3745 6.44158 11.4619C6.45897 11.5492 6.45005 11.6398 6.41596 11.7221C6.38187 11.8044 6.32413 11.8747 6.25005 11.9242C6.17597 11.9737 6.08889 12 5.99981 12Z"
                      fill="#74788D"
                    />
                  </svg>
                </button>
              </li>
              {createPageList(totalPages, current).map((item) => (
                <li key={item}>
                  <button
                    className={`flex h-[36px] items-center justify-center border-l border-r border-transparent px-2 text-base font-medium text-[#74788D] hover:bg-gray-2 ${
                      item === current
                        ? "min-w-10 bg-[#EBEBEB] border-[#CED4DA]"
                        : "min-w-[36px]"
                    }`}
                    onClick={() => setCurrent(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}

              <li>
                <button
                  className="flex h-[36px] items-center justify-center border border-transparent px-[15px] text-base font-medium text-dark hover:bg-gray-2"
                  onClick={increase}
                >
                  <svg
                    fill="none"
                    height="12"
                    viewBox="0 0 7 12"
                    width="7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.599801 12C0.658936 12 0.717497 11.9884 0.772139 11.9658C0.826782 11.9432 0.876434 11.91 0.918262 11.8682L6.46779 6.31841C6.55219 6.23398 6.59961 6.11948 6.59961 6.00009C6.59961 5.88071 6.55219 5.76621 6.46779 5.68178L0.918261 0.131956C0.87646 0.0901348 0.826831 0.0569566 0.772208 0.0343157C0.717584 0.0116748 0.659036 1.44691e-05 0.599905 5.3702e-07C0.540776 -1.33951e-05 0.482222 0.0116194 0.427588 0.0342346C0.372954 0.0568497 0.323308 0.0900046 0.281487 0.131806C0.239666 0.173607 0.206489 0.223236 0.183847 0.27786C0.161207 0.332484 0.149546 0.391032 0.149532 0.450162C0.149518 0.509292 0.161151 0.567846 0.183766 0.62248C0.206381 0.677114 0.239536 0.726759 0.281338 0.76858L5.5127 5.99994L0.281339 11.2313C0.218332 11.2943 0.175418 11.3745 0.15803 11.4619C0.14064 11.5492 0.149556 11.6398 0.18365 11.7221C0.217743 11.8044 0.275483 11.8747 0.34956 11.9242C0.423637 11.9737 0.510724 12 0.599801 12Z"
                      fill="#74788D"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryList;

const BadgesItem = ({ children }) => {
  return (
    <span
      className={`inline-block bg-blue w-fit text-white py-0 px-2 text-[10px] font-medium rounded-full`}
    >
      {children}
    </span>
  );
};
