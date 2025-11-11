"use client";

import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { parsePhoneNumber } from "react-phone-number-input";
import { toast } from "react-toastify";

import { GET_CUSTOMER_ADDRESS_DATA, DELETE_CUSTOMER_ADDRESS } from "./query";

import { Checkbox } from "@/shared/components/(common)/ui/checkbox";
import DeleteBoxImage from "@/assets/icons/delete-box.png";
import EditBoxImage from "@/assets/icons/edit-box.png";
import Title from "@/shared/components/(common)/Title/Title";

const formatPhoneNumber = (phone, country = "US") => {
  if (phone) {
    const parsedNumber = parsePhoneNumber(phone, country);

    if (parsedNumber?.countryCallingCode) {
      return `+ ${parsedNumber.countryCallingCode} ${parsedNumber.formatNational()}`;
    }

    return phone;
  }
};
const getFilteredList = (addresses = []) => {
  const getPriorityScore = (address) => {
    const billingScore = address.default_billing ? 2 : 0;
    const shippingScore = address.default_shipping ? 1 : 0;

    return billingScore + shippingScore;
  };

  return [...addresses].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
};

const MyAddress = () => {
  const { t, i18n } = useTranslation();
  const { data, refetch } = useQuery(GET_CUSTOMER_ADDRESS_DATA);
  const [deleteAddress] = useMutation(DELETE_CUSTOMER_ADDRESS);

  const sortedAddresses = getFilteredList(data?.customer?.addresses);
  const handleDelete = async (addressId) => {
    try {
      const confirmed = window.confirm(t("Are you certain you want to delete this address?"));

      if (confirmed) {
        await deleteAddress({ variables: { id: addressId } });

        toast.success(t("You deleted the address."));

        await refetch();
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="w-full min-h-full bg-whitesmoke-100 overflow-hidden tracking-normal text-left text-11xl text-black font-sf-pro-display">
      <main className="bg-white">
        <div className="px-7 py-7">
          <Title className="text-paragraph mt-0 mb-9 text-[1.75rem]">{t("Addresses")}</Title>
          <div className="add-addres-flex-box">
            <Link href="/customer/dashboard/add-address">
              <div className="flex justify-center items-center border border-dashed border-blue rounded-[5px] py-8 px-6 gap-5 bg-[#f4fcfe]">
                <svg fill="none" height="30" viewBox="0 0 30 30" width="30" xmlns="http://www.w3.org/2000/svg">
                  <rect fill="#00C0F3" height="30" rx="1.25" width="2.5" x="13.7495" />
                  <rect
                    fill="#00C0F3"
                    height="30"
                    rx="1.25"
                    transform="rotate(90 30 13.75)"
                    width="2.5"
                    x="30"
                    y="13.75"
                  />
                </svg>
                <h3 className="text-xl text-[#74788D] font-medium leading-6">{t("Add New Address")}</h3>
              </div>
            </Link>
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2 w-full mt-5 overflow-y-auto ">
              {sortedAddresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white shadow overflow-hidden sm:rounded-lg h-full px-6 py-5 border border-[#CED4DA] flex flex-col"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-2xl leading-6 text-[#495057]">
                      {address.firstname} {address.lastname}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Link
                        aria-label={t("Edit")}
                        className="flex items-center gap-1 cursor-pointer"
                        href={`/customer/dashboard/my-address/${address.id}`}
                      >
                        <Image alt="Add Plus" src={EditBoxImage} />
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-900 mr-2">{t("Edit")}</span>
                      </Link>

                      <button
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Image alt="Add Plus" src={DeleteBoxImage} />
                        <span aria-label={t("Delete")} className="text-sm font-medium text-red-600 hover:text-red-900">
                          {t("Delete")}
                        </span>
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm md:text-base text-[#74788D]">{address.company}</p>
                  <p className="mt-1 max-w-2xl text-sm md:text-base text-[#74788D]">
                    {formatPhoneNumber(address.telephone)}
                  </p>
                  <div className="flex flex-wrap items-center mt-1 gap-1">
                    <p className="max-w-2xl text-sm md:text-base text-[#74788D]">
                      {address.street} {address.city}
                    </p>
                    <p className="max-w-1xl text-sm md:text-base text-[#74788D]">
                      {address.postcode} {address.country_code}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-11 pt-5 mt-auto">
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox checked={address.default_billing} id="billing" />
                      <label
                        className="text-sm font-semibold text-[#74788D] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="billing"
                      >
                        {t("Default Billing Address")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox checked={address.default_shipping} id="shipping" />
                      <label
                        className="text-sm font-semibold text-[#74788D] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="shipping"
                      >
                        {t("Default Shipping Address")}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAddress;
