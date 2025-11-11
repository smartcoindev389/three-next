import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";

import { Referral } from "../types";

import ReferralTable from "./ReferralTable";
import ReferralCards from "./ReferralCards";

import Title from "@/shared/components/(common)/Title/Title";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/(common)/ui/select";
import useMobile from "@/hooks/useMobile";
import { GET_REFERRAL_LIST } from "@/lib/apollo/queryes/referral";
import Loader from "@/shared/components/(common)/Loader/Loader";

interface ReferralResponse {
  referralFactoryReferralsStatistics: {
    last_page: number;
    items: Referral[];
  };
}

const ITEMS_PER_PAGE = 10;

const ReferralsList: FC = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const [page, setPage] = useState(1);
  const [fetchReferral, { data, loading }] = useLazyQuery<ReferralResponse>(
    GET_REFERRAL_LIST,
    {
      variables: { page, page_size: ITEMS_PER_PAGE },
    },
  );
  const totalPages = data?.referralFactoryReferralsStatistics.last_page || 0;
  const sortOptions = [{ title: t("Most Recent"), value: "most" }];
  const [sort, setSort] = useState("most");
  const handleIncrementPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleDecrementPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    void fetchReferral();
  }, [page]);

  return (
    <div>
      <div className="bg-white rounded-[5px] shadow ">
        <div className="p-5 md:p-7 flex justify-between items-center mb-2">
          <Title className="text-[24px] md:text-[30px]">{t("Referrals")}</Title>
          <div className="">
            <Select
              defaultValue={sort}
              onValueChange={(newValue) => setSort(newValue)}
            >
              <SelectTrigger
                className="w-[155px] md:w-[230px] pl-3 pr-2 md:pl-6 md:pr-3 py-3 h-9 md:py-5 leading-none bg-white text-base md:text-lg rounded-full border border-[#E0E0E0] font-medium"
                iconclass="text-[#434345]"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-[#00C0F3] text-white">
                <SelectGroup>
                  {sortOptions?.map((val, index) => (
                    <SelectItem key={index} value={val.value}>
                      {val?.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-2 overflow-x-auto pb-6">
          {loading && <Loader />}
          {isMobile ? (
            <ReferralCards
              data={data?.referralFactoryReferralsStatistics.items || []}
            />
          ) : (
            <ReferralTable
              data={data?.referralFactoryReferralsStatistics.items || []}
            />
          )}
        </div>
      </div>
      <div className="pt-4 pb-4 pl-5 flex items-center justify-between">
        <div className="text-right text-sm sm:text-lg font-light font-SF-Pro">
          {t("Showing")}&nbsp;
          <span className="text-zinc-700 text-xl font-bold ">
            {ITEMS_PER_PAGE}
          </span>
          &nbsp;{t("items per page")}
        </div>
        <div className="flex items-center border border-[#E0E0E0] px-3 py-1 rounded-full">
          <button
            className={
              page === 1
                ? `text-[#C2C2C2] fill-current cursor-not-allowed`
                : `text-[#545454] fill-current cursor-pointer`
            }
            onClick={() => handleDecrementPage()}
          >
            <svg height="23" viewBox="0 0 23 23" width="23">
              <path d="M15.5996 10.753H9.11211L11.3621 8.53529C11.6996 8.20808 11.6996 7.69908 11.3621 7.37187C11.0246 7.04466 10.4996 7.04466 10.1621 7.37187L6.52461 10.9712C6.18711 11.2984 6.18711 11.8074 6.52461 12.1346L10.1621 15.7339C10.3121 15.8793 10.5371 15.9884 10.7621 15.9884C10.9871 15.9884 11.1746 15.9157 11.3621 15.7703C11.6996 15.4431 11.6996 14.9341 11.3621 14.6069L9.11211 12.3891H15.5996C16.0496 12.3891 16.4246 12.0255 16.4246 11.5893C16.4621 11.1166 16.0871 10.753 15.5996 10.753Z" />
              <path d="M11.3625 0.573242C5.1 0.573242 0 5.4814 0 11.553C0 17.6245 5.1 22.5327 11.3625 22.5327C17.625 22.5327 22.725 17.6245 22.725 11.553C22.725 5.4814 17.625 0.573242 11.3625 0.573242ZM11.3625 20.933C6.0375 20.933 1.6875 16.7156 1.6875 11.553C1.6875 6.39032 6.0375 2.17294 11.3625 2.17294C16.6875 2.17294 21.0375 6.39032 21.0375 11.553C21.0375 16.7156 16.6875 20.933 11.3625 20.933Z" />
            </svg>
          </button>
          <div className="mx-5 sm:mx-8 text-[31px] font-normal text-[#00C0F3] leading-none">
            {page}
          </div>
          <button
            className={
              page >= totalPages
                ? `text-[#C2C2C2] fill-current cursor-not-allowed`
                : `text-[#545454] fill-current cursor-pointer`
            }
            onClick={() => handleIncrementPage()}
          >
            <svg height="23" viewBox="0 0 23 23" width="23">
              <path d="M12.5623 7.40215C12.2248 7.07494 11.6998 7.07494 11.3623 7.40215C11.0248 7.72936 11.0248 8.23835 11.3623 8.56556L13.6123 10.7833H7.1248C6.6748 10.7833 6.2998 11.1469 6.2998 11.5832C6.2998 12.0194 6.6748 12.383 7.1248 12.383H13.6123L11.3623 14.6008C11.0248 14.928 11.0248 15.437 11.3623 15.7642C11.5123 15.9096 11.7373 15.9823 11.9623 15.9823C12.1873 15.9823 12.4123 15.9096 12.5623 15.7278L16.2373 12.1285C16.5748 11.8013 16.5748 11.2923 16.2373 10.9651L12.5623 7.40215Z" />
              <path d="M11.3625 0.603516C5.1 0.603516 0 5.51167 0 11.5832C0 17.6548 5.1 22.563 11.3625 22.563C17.625 22.563 22.725 17.6548 22.725 11.5832C22.725 5.51167 17.625 0.603516 11.3625 0.603516ZM11.3625 20.9633C6.0375 20.9633 1.6875 16.7459 1.6875 11.5832C1.6875 6.42059 6.0375 2.20321 11.3625 2.20321C16.6875 2.20321 21.0375 6.42059 21.0375 11.5832C21.0375 16.7459 16.6875 20.9633 11.3625 20.9633Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralsList;
