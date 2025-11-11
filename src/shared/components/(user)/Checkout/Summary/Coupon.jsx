import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";

import InputText from "@/shared/components/(main)/InputText/InputText";
import {
  APPLY_COUPON_TO_CART,
  GET_VALID_COUPONS,
} from "@/lib/apollo/queryes/checkout";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import Price from "@/shared/components/(common)/Currency/Price";
import BaseButton from "@/shared/components/(main)/BaseButton/BaseButton";
import Title from "@/shared/components/(common)/Title/Title";
import { useCart } from "@/providers/CartProvider/useCart";

export default function Coupon() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const { cart, fetchCart } = useCart();
  const methods = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showCouponList] = useState(false);
  const [coupons, setCoupons] = useState({});
  const [applyCouponToCart, { loading }] = useMutation(APPLY_COUPON_TO_CART);
  const { data } = useQuery(GET_VALID_COUPONS);

  useEffect(() => {
    if (data) {
      setCoupons(data);
    }
  }, [data]);

  const handleClick = (code) => {
    setValue("coupon_code", code);
    toggleCoupons();
  };

  const onSubmit = (data) => {
    applyCouponToCart({
      variables: {
        cart_id: cart?.id,
        coupon_code: data.coupon_code,
      },
      onError(err) {
        setError(err.message);
        toast({ type: "error", description: err.message });
      },
    }).then((res) => {
      if (!res["errors"]) {
        toast({
          type: "success",
          description: `The coupon code ${data.coupon_code} was applied.`,
        });
        fetchCart();
      }
    });
  };

  const toggleCoupons = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <div className="w-full bg-white border border-[#CACBCF] shadow-1 rounded-[8px] mt-4 py-3 flex flex-col justify-center items-center">
      <div className="flex justify-between w-full px-5 mb-2">
        <Title>{t("Coupon Code")}</Title>
        {showCouponList && (
          <button
            className="flex items-center gap-1.5 self-end"
            onClick={toggleCoupons}
          >
            <svg
              fill="none"
              height="14"
              viewBox="0 0 15 14"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M3 14C1.34315 14 0 12.6071 0 10.8889V10.1111C0 9.68156 0.345002 9.34602 0.736421 9.20549C1.6174 8.88918 2.25 8.0212 2.25 7C2.25 5.9788 1.6174 5.11082 0.736421 4.79451C0.345003 4.65398 0 4.31844 0 3.88889V3.11111C0 1.39289 1.34315 0 3 0H12C13.6569 0 15 1.39289 15 3.11111V3.88889C15 4.31844 14.655 4.65398 14.2636 4.79451C13.3826 5.11082 12.75 5.9788 12.75 7C12.75 8.0212 13.3826 8.88918 14.2636 9.20549C14.655 9.34602 15 9.68156 15 10.1111V10.8889C15 12.6071 13.6569 14 12 14H3ZM5.25 5.44444C5.66421 5.44444 6 5.09622 6 4.66667C6 4.23711 5.66421 3.88889 5.25 3.88889C4.83579 3.88889 4.5 4.23711 4.5 4.66667C4.5 5.09622 4.83579 5.44444 5.25 5.44444ZM10.5 9.33333C10.5 9.76289 10.1642 10.1111 9.75 10.1111C9.33579 10.1111 9 9.76289 9 9.33333C9 8.90378 9.33579 8.55556 9.75 8.55556C10.1642 8.55556 10.5 8.90378 10.5 9.33333ZM10.1477 5.07915C10.3674 4.85134 10.3674 4.48199 10.1477 4.25419C9.92808 4.02638 9.57192 4.02638 9.35225 4.25419L4.85225 8.92085C4.63258 9.14866 4.63258 9.51801 4.85225 9.74581C5.07192 9.97362 5.42808 9.97362 5.64775 9.74581L10.1477 5.07915Z"
                fill="#00C0F3"
                fillRule="evenodd"
              />
            </svg>
            <div className="text-sm font-medium text-blue">View all Coupon</div>
          </button>
        )}

        {isOpen && (
          <div className="absolute top-[45%] left-0 right-0 mx-auto w-fit max-w-max bg-white shadow-xl rounded-lg p-4 border border-[#E0E0E0]">
            <h2 className="text-[#00C0F3] font-bold text-lg mb-4">
              Select Coupon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons?.valid_coupons?.map((coupon, index) => (
                <button
                  key={index}
                  className="hover:cursor-pointer hover:bg-[#F3F3F3] outline-0 w-full max-w-max flex flex-col border rounded-lg p-4 shadow-md"
                  onClick={() => handleClick(coupon.code)}
                >
                  <h3 className="text-[#6D6E71] text-sm">
                    Magento Coupon Code
                  </h3>
                  <p className="text-[#00C0F3] text-lg font-bold">
                    {coupon.code}
                  </p>
                  <p className="text-[#6D6E71] text-lg font-bold">
                    {coupon.simple_action === "by_fixed" ||
                    coupon.simple_action === "cart_fixed" ? (
                      <Price amount={coupon.discount} />
                    ) : (
                      `${Math.round(coupon.discount)}%`
                    )}
                    <span className="ml-1 text-[#6D6E71] font-normal">
                      DISCOUNT
                    </span>
                  </p>
                  {coupon.days_left && (
                    <p className="text-[#6D6E71] text-sm mt-[20px]">
                      Expires in{" "}
                      <span className="font-bold text-base">
                        {coupon.days_left}
                      </span>{" "}
                      Days
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <FormProvider {...methods}>
        <form className={"w-full"} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-[100%] gap-2.5 px-5">
            <InputText
              className="bg-white rounded-[5px] border-[#CACBCF] text-[#727272] py-3 font-medium text-[15px] w-full max-h-[42px]"
              errors={errors}
              label={"coupon_code"}
              name={"coupon_code"}
              options={{ required: "This field is required" }}
              placeholder={"Enter Coupon Code"}
              register={register}
              width={"w-auto flex-1"}
            />
            <BaseButton
              className="h-auto max-h-[42px] min-w-32"
              disabled={loading}
              type="submit"
            >
              {loading ? t("Processing...") : t("Apply")}
            </BaseButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
