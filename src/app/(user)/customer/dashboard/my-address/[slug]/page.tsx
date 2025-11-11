"use client";

import { FC, FormEvent, useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Header from "@/shared/components/(user)/AccountAddressHeader/Header";
import SaveButton from "@/shared/components/(user)/SaveButton/SaveButton";
import { InputPhone } from "@/shared/components/(common)/ui/input-phone";
import { Toaster } from "@/shared/components/(common)/ui/toaster";
import AutocompleteAddressForm from "@/shared/components/(user)/AutoCompleteForm/autoCompleteForm";
import { Address } from "@/types/types";
import Loader from "@/shared/components/(common)/Loader/Loader";
import { getFormValues } from "@/utils/utils";
import { GET_CUSTOMER_ADDRESS_DATA, UPDATE_CUSTOMER_ADDRESS } from "@/lib/apollo/queryes/customer";

interface CustomerData {
  customer: {
    addresses: Address[];
  };
}
interface EditAddressProps {
  params: Promise<{
    slug: string;
  }>;
}

const EditAddress: FC<EditAddressProps> = ({ params }) => {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);
  const { t } = useTranslation();
  const router = useRouter();
  const [updateAddress, { loading: updateAddressLoading, data }] = useMutation(UPDATE_CUSTOMER_ADDRESS);
  const { data: customerAddressData, loading: loadingCustomerData } = useQuery<CustomerData>(GET_CUSTOMER_ADDRESS_DATA);
  const defaultAddress = useMemo(() => {
    if (!customerAddressData || !resolvedParams) return null;

    const findBySlug = ({ id }: Address) => id.toString() === resolvedParams.slug;
    const address = customerAddressData.customer.addresses.find(findBySlug);
    const { region_id, region } = address?.region || {};

    return { ...address, country: address?.country_code, region, region_id };
  }, [customerAddressData, resolvedParams]);

  if (loadingCustomerData || !resolvedParams) return <Loader className="fixed inset-0" />;
  if (!defaultAddress) return "No data";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = getFormValues(event.currentTarget);
    const { region_id = 0, country, defaultShipping, defaultBilling, ...rest } = values;
    const variables = {
      ...rest,
      id: defaultAddress.id,
      country_code: country,
      default_shipping: !!defaultShipping,
      default_billing: !!defaultBilling,
      region: {
        region_id,
      },
    };

    try {
      await updateAddress({ variables });
      toast.success(t("You saved the address."));
    } catch (error) {
      toast.error(t("Error updating address"));
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-full bg-whitesmoke-100 overflow-hidden tracking-[normal] text-left text-11xl font-sf-pro-display p-6">
      <Header className="md:hidden" title="Edit Address" />
      <main className="w-full bg-white shadow-sm rounded-md">
        <div className="px-6 py-6">
          <Header className="max-md:hidden" title="Edit Address" />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="">
              <div className="flex items-end">
                <h3 className="mt-0 relative text-lg font-semibold text-[#495057] font-inherit inline-block">
                  <Trans t={t}>Contact Information</Trans>
                </h3>
                <div className="grow h-[1px] bg-[#CED4DA] mb-[0.8em] ml-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                <div className="w-full">
                  <label className="block text-base text-[#434345] mb-1" htmlFor="firstname">
                    <Trans t={t}>First Name</Trans>
                    <span className="text-[#F25353] ml-1">*</span>
                  </label>
                  <input
                    required
                    className="block w-full rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2.5"
                    defaultValue={defaultAddress.firstname}
                    id="firstname"
                    name="firstname"
                    placeholder={t("First Name")}
                    type="text"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-base text-[#434345] mb-1" htmlFor="lastname">
                    <Trans t={t}>Last Name</Trans>
                    <span className="text-[#F25353] ml-1">*</span>
                  </label>
                  <input
                    required
                    className="block w-full rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2.5"
                    defaultValue={defaultAddress.lastname}
                    id="lastname"
                    name="lastname"
                    placeholder={t("Last Name")}
                    type="text"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-base text-[#434345] mb-1" htmlFor="company">
                    <Trans t={t}>Company Name</Trans>
                  </label>
                  <input
                    required
                    className="block w-full rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2.5"
                    defaultValue={defaultAddress.company}
                    id="company"
                    name="company"
                    placeholder="Company"
                    type="text"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-base text-[#434345] mb-1" htmlFor="telephone">
                    {t("Phone No.")}
                  </label>

                  <InputPhone
                    className="border-0 py-0 px-0"
                    countrySelectorStyleProps={{
                      buttonClassName: "!border-0 !h-[100%] flex !items-center !bg-white",
                    }}
                    id="telephone"
                    inputProps={{
                      className:
                        "w-full border-y-1 border-[#CED4DA] rounded focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-300 flex-grow py-2.5",
                    }}
                    name="telephone"
                    placeholder={t("Enter Phone Number")}
                    value={defaultAddress.telephone}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <section className={"bg-white gap-5 py-7"}>
                <div className="flex items-end">
                  <p className="text-lg text-[#495057] font-semibold">
                    <Trans t={t}>Address</Trans>
                  </p>
                  <div className="grow h-[1px] bg-[#CED4DA]  mb-[0.8em] ml-2" />
                </div>
                <AutocompleteAddressForm editMode address={defaultAddress} />
              </section>

              <div className="mt-0 md:mt-4 w-full md:w-1/2">
                <div className="w-full md:p-7 bg-white rounded-[5px]">
                  <label className="flex items-center text-sm md:text-base text-gray-900 cursor-pointer">
                    <input
                      className="mr-2 h-5 w-5 text-blue-600 focus:ring-transparent border-gray-300 rounded"
                      defaultChecked={defaultAddress.default_shipping}
                      name="defaultShipping"
                      type="checkbox"
                    />
                    <Trans t={t}>Use as my default Shipping Address</Trans>
                  </label>

                  <label className="flex items-center mt-4 text-sm md:text-base text-gray-900 cursor-pointer">
                    <input
                      className="mr-2 h-5 w-5 text-blue-600 focus:ring-transparent border-gray-300 rounded"
                      defaultChecked={defaultAddress.default_billing}
                      name="defaultBilling"
                      type="checkbox"
                    />
                    <Trans t={t}>Use as my default Billing Address</Trans>
                  </label>
                  <div className="flex justify-start mt-7">
                    <SaveButton loading={updateAddressLoading} />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {data && router.push("/customer/dashboard/my-address")}
          <Toaster position="bottom-right" reverseOrder={false} />
        </div>
      </main>
    </div>
  );
};

export default EditAddress;
