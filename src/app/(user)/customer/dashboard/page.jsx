"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import Header from "@/shared/components/(user)/Home/Header";
import RecentOrders from "@/shared/components/(user)/Home/RecentOrders";
import Subscribe from "@/shared/components/(user)/Home/Subscribe";
import ReferAndEarn from "@/shared/components/(user)/Home/ReferAndEarn";
import { GET_CUSTOMER_RECENT_ORDERS } from "@/lib/apollo/queryes/customer";
import DiscountOwned from "@/shared/components/(user)/Home/DiscountEarned";
import TrackShipment from "@/shared/components/(user)/TrackShipment/TrackShipment";
import Title from "@/shared/components/(common)/Title/Title";

const Dashboard = () => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_CUSTOMER_RECENT_ORDERS);
  const [open, setOpen] = useState(false);
  const userImg = useMemo(() => {
    const img = data?.customer?.custom_attributes?.find(
      (val) => val.code === "profile_pic",
    );
    const fileName = img?.value;

    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/media${fileName}`;
  }, []);
  const customerData = data?.customer;

  const checkTwoFactorAuthentication = (attributes) => {
    if (attributes === undefined) return true;

    return attributes?.some(
      (attr) => attr.code === "two_factor_authentication" && attr.value === "1",
    );
  };

  useEffect(() => {
    const attributeValues = data?.customer?.custom_attributes;
    const hasTwoFactorAuthentication =
      checkTwoFactorAuthentication(attributeValues);

    setOpen(!hasTwoFactorAuthentication);
  }, [data]);

  const { firstname, lastname, orders } = customerData || {};
  const name = firstname && lastname ? `${firstname} ${lastname}` : "";

  return (
    <div>
      <div className="bg-[#001322]">
        <Header
          email={customerData?.email}
          loading={loading}
          name={name}
          open={open}
          setOpen={setOpen}
          userImg={userImg}
        />
        <div className="flex flex-col 2xl:flex-row gap-[22px] mt-6">
          <div className="w-full 2xl:w-3/4">
            <div className="flex flex-col grow p-5 md:p-10 w-full text-lg bg-[#001322] rounded-[20px] border border-solid border-[#97E3FF5C] bg-gradient-to-br from=[#001322] to-[#004C88] shadow-sm max-md:px-5 min-h-72">
              <div className="w-full overflow-x-auto">
                <Title className="mb-3 text-paragraph text-white">
                  {t("Recent Orders")}
                </Title>
                <RecentOrders isLoading={loading} orders={orders?.items} />
              </div>
            </div>
            <div className="flex flex-col 2xl:flex-row gap-[22px] mt-6">
              <div className="flex flex-col 2xl:w-1/2 max-md:max-w-full gap-[22px]">
                <div className="flex flex-col grow px-8 md:px-16 py-6 md:py-12 w-full text-lg bg-[#001322] rounded-[20px] border border-solid border-[#97E3FF5C] bg-gradient-to-br from=[#001322] to-[#004C88] shadow-sm">
                  <ReferAndEarn />
                </div>
                <div className="grow pl-8 pr-8 md:pl-16 py-6 md:py-12 w-full text-lg bg-[#001322] rounded-[20px] border border-solid border-[#97E3FF5C] bg-gradient-to-br from=[#001322] to-[#004C88] shadow-sm max-md:px-5">
                  <Subscribe />
                </div>
              </div>
              <div className="flex flex-col 2xl:w-1/2 max-md:max-w-full">
                <div className="flex flex-col grow px-7 py-8 w-full text-lg bg-[#001322] rounded-[20px] border border-solid border-[#97E3FF5C] bg-gradient-to-br from=[#001322] to-[#004C88] shadow-sm max-md:px-5">
                  <DiscountOwned type="1" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full 2xl:w-1/4 bg-[#001322] rounded-[20px] border border-solid border-[#97E3FF5C] bg-gradient-to-br from=[#001322] to-[#004C88] shadow-sm">
            <TrackShipment isLoading={loading} orders={orders?.items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
