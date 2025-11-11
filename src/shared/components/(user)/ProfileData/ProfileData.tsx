"use client";

import { FC } from "react";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import Loader from "@/shared/components/(common)/Loader/Loader";
import { GET_SHORT_CUSTOMER_DATA } from "@/lib/apollo/queryes/customer";
import Avatar from "@/shared/components/(user)/Avatar/Avatar";

interface ProfileDataInput {
  className?: string;
  config?: string;
}

const ProfileData: FC<ProfileDataInput> = ({ className, config }) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_SHORT_CUSTOMER_DATA);
  const customerData = data?.customer;

  return (
    <div className={`${className} flex gap-4 items-center max-md:flex-wrap`}>
      {loading ? (
        <div
          className={
            "aspect-square h-[100px] max-w-full overflow-hidden rounded-full shrink-0 w-[100px]"
          }
        >
          <Loader className={"h-full"} />
        </div>
      ) : (
        <>
          <Avatar
            className="w-[60px] md:w-[100px]"
            customerData={customerData}
            loading={loading}
          />
          <div>
            <h1 className="grow text-[1.75rem] md:text-4xl text-white font-din-condensed">
              <span className="font-bold">{t("Hello")} </span>
              <span className="font-light">
                {customerData?.firstname && customerData?.lastname
                  ? customerData.firstname + " " + customerData.lastname
                  : ""}
              </span>
            </h1>
            <h2 className="text-[1rem] md:text-[1.125rem] text-white max-md:max-w-full font-light">
              {customerData?.email}
            </h2>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileData;
