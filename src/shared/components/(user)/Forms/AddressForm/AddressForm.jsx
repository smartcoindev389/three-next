import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputPhone } from "@/shared/components/(common)/ui/input-phone";
import ChooseAddressForm from "@/shared/components/(user)/Forms/ChooseAddressForm/ChooseAddressForm";
import BaseButton from "@/shared/components/(main)/BaseButton/BaseButton";
import { addressToFormAddress, customerAddressToFormAddress } from "@/shared/components/(user)/Checkout/common";

export default function AddressForm({
  addresses,
  initAddress = {},
  loading = false,
  handleChooseAddressForm,
  onAddressSubmit,
}) {
  const { countries } = useSelector((state) => state.checkout);
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isDirty, dirtyFields, errors },
  } = useForm();

  const countryFieldObserver = watch("country");
  const [regions, setRegions] = useState([]);
  const phoneInputRef = useRef();

  useEffect(() => {
    if (Object.keys(initAddress).length > 0) {
      _updateFields(addressToFormAddress(initAddress));
    }
  }, [initAddress]);

  useEffect(() => {
    onCountryChange();
  }, [countryFieldObserver]);

  const onCountryChange = useCallback(() => {
    const currentCountry = countries.find(({ id }) => id === countryFieldObserver);

    if (currentCountry?.available_regions) {
      const regions = [{ id: "", name: "State" }, ...currentCountry.available_regions];

      setRegions(regions);
    } else {
      setRegions([]);
    }

    if (dirtyFields.country) {
      phoneInputRef?.current?.setCountry(currentCountry?.id?.toLowerCase() || "us");
      setValue("region_id", null);
      setValue("region", "");
    }
  }, [countryFieldObserver]);

  const onSubmit = (data) => {
    const value = {
      ...data,
      firstname: data.firstname || "guest",
      lastname: data.lastname || "user",
      country_code: data.country,
      region_id: data.region_id ? Number(data.region_id) : 0,
      region: data.region_id > 0 ? "" : data?.region?.region || data?.region,
      street: [data?.street0, data?.street1 || ""],
    };

    onAddressSubmit(value, isDirty);
  };

  const onChooseAddress = (address) => {
    _updateFields(customerAddressToFormAddress(address));
    handleChooseAddressForm(address);
  };

  const _updateFields = (newAddress) => {
    reset(newAddress);
  };

  const getInputClasses = (name) => {
    return `mb-4 p-3 w-full ${errors[name] ? "border-[#F46A6A]" : "border-gray-300"} rounded-md placeholder-[#c2c2c2]`;
  };

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <section className="mt-4">
        <div className="autocomplete-address-form flex flex-wrap mt-4 md:mt-8">
          <div className="w-full">
            <div>
              <label className="block text-[18px] font-medium text-[#949390] mb-1">{t("Enter your information")}</label>
              <div className="grid grid-cols-2 gap-x-2 items-end gap-y-0 w-full">
                <input
                  {...register("firstname", {
                    required: true,
                  })}
                  autoComplete="off"
                  className={getInputClasses("firstname")}
                  placeholder={t("First name")}
                />
                <input
                  {...register("lastname", {
                    required: true,
                  })}
                  autoComplete="off"
                  className={getInputClasses("lastname")}
                  placeholder={t("Last name")}
                />
              </div>

              <input
                {...register("street0", {
                  required: true,
                })}
                autoComplete="off"
                className={getInputClasses("street0")}
                placeholder={t("Street Address")}
              />
              <input
                {...register("street1")}
                autoComplete="off"
                className={getInputClasses("street1")}
                placeholder={t("Apt / Suite / Other")}
              />
            </div>
          </div>

          <div className={`grid grid-cols-2 xl:grid-cols-4 gap-x-2 items-end gap-y-0 w-full`}>
            <div className="">
              <select
                {...register("country", {
                  required: true,
                  maxLength: 3,
                })}
                autoComplete="off"
                className={getInputClasses("country") + " mb-0"}
              >
                {countries.map((item, index) => (
                  <option key={index} value={item?.id}>
                    {item?.full_name_english}
                  </option>
                ))}
              </select>
            </div>

            {regions.length > 0 ? (
              <div>
                <select
                  {...register("region_id", {
                    required: true,
                  })}
                  autoComplete="off"
                  className={getInputClasses("region_id")}
                >
                  {regions.map((item, index) => (
                    <option key={index} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                {...register("region")}
                autoComplete="off"
                className={getInputClasses("region")}
                placeholder={t("State")}
              />
            )}

            <input
              {...register("city", {
                required: true,
              })}
              autoComplete="off"
              className={getInputClasses("city")}
              placeholder={t("City")}
            />

            <div className="">
              <input
                {...register("postcode", {
                  required: true,
                })}
                autoComplete="off"
                className={getInputClasses("postcode")}
                placeholder={t("Zip Code")}
              />
            </div>
          </div>
          <Controller
            control={control}
            name="telephone"
            render={({ field: { onChange, value } }) => (
              <InputPhone
                ref={phoneInputRef}
                autoComplete="off"
                className={`!text-base py-2 md:w-[288px] ${errors.telephone ? "border-[#F46A6A]" : "border-gray-300"}`}
                defaultCountry={(localStorage.getItem("lang") || "en_US").split("_")[1].toLowerCase()}
                placeholder="Phone Number"
                value={value}
                onChange={onChange}
              />
            )}
            rules={{
              required: true,
              minLength: 8,
            }}
          />
        </div>
      </section>

      <ChooseAddressForm addresses={addresses} onChooseAddress={onChooseAddress} />

      <div className="flex mt-6">
        <BaseButton className="w-full md:max-w-[300px]" type="submit">
          {loading ? t("Processing...") : t("Continue")}
        </BaseButton>
      </div>
    </form>
  );
}
