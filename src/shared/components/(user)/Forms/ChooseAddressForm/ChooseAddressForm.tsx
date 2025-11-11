import type { Swiper as SwiperType } from "swiper";

import React, { FC, ReactNode, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";

import { Address } from "@/types/types";

interface ChooseAddressFormProps {
  addresses: Address[];
  onChooseAddress: (address: any) => void;
}

const BREAKPOINTS = {
  639: {
    slidesPerView: 2,
  },
  767: {
    slidesPerView: 1,
  },
  1023: {
    slidesPerView: 2,
  },
  1279: {
    slidesPerView: 3,
  },
};

const ChooseAddressForm: FC<ChooseAddressFormProps> = ({
  addresses,
  onChooseAddress,
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [addressesSwiper, setAddressesSwiper] = useState<SwiperType | null>(
    null,
  );

  const onAddressClick = (address: any) => {
    onChooseAddress(address);
    setShow(false);
  };

  const renderAddress = (address: any) => {
    return (
      <button
        className="flex flex-col text-[#545454] border px-[30px] py-[40px] rounded-[8px] text-base text-start w-full h-full"
        onClick={() => onAddressClick(address)}
      >
        <div className={"font-[500] mb-3 text-[20px]"}>
          {address.firstname} {address.lastname}
        </div>
        <div className={"font-[400]"}>
          {address.street.map((item: ReactNode, index: number) => (
            <React.Fragment key={index}>{item} </React.Fragment>
          ))}
          <br />
          {address.city}, {address.postcode}
        </div>
        <div className={"font-[500] mt-3"}>{address.telephone}</div>
      </button>
    );
  };

  if (addresses?.length < 2) return null;

  return (
    <>
      <button
        className="flex text-sm text-blue underline pt-6 md:pt-0 md:absolute top-4 right-6"
        type="button"
        onClick={() => setShow(true)}
      >
        {t("Choose Address")}
      </button>

      {show && (
        <div
          className="absolute bg-white border left-[50%] max-xl:max-w-full pt-[40px] px-[18px] rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.04)] top-[-1px] transform translate-x-[-50%]"
          style={{ width: "125%" }}
        >
          <button
            className="absolute leading-7 right-4 text-[#00C0F3] text-sm top-2 underline"
            type="button"
            onClick={() => setShow(false)}
          >
            {t("Close")}
          </button>

          <Swiper
            autoHeight={true}
            breakpoints={BREAKPOINTS}
            className="w-full"
            slidesPerView={1}
            spaceBetween={16}
            onBeforeInit={(swiper) => setAddressesSwiper(swiper)}
          >
            {addresses.map((address, index) => (
              <SwiperSlide key={index} className="!h-full">
                {renderAddress(address)}
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center mt-3">
            <button
              className={addresses.length <= 3 ? " xl:hidden" : ""}
              type="button"
              onClick={() => addressesSwiper?.slidePrev()}
            >
              <Image
                alt="arrow-right"
                height={54}
                src="/assets/slider-arrow-left.svg"
                width={54}
              />
            </button>
            <button
              className={addresses.length <= 3 ? " xl:hidden" : ""}
              type="button"
              onClick={() => addressesSwiper?.slideNext()}
            >
              <Image
                alt="arrow-right"
                height={54}
                src="/assets/slider-arrow-right.svg"
                width={54}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChooseAddressForm;
