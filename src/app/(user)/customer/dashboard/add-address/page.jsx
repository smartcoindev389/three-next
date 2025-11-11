"use client";

import { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Trans, useTranslation } from "react-i18next";

import Header from "@/shared/components/(user)/AccountAddressHeader/Header";
import SaveButton from "@/shared/components/(user)/SaveButton/SaveButton";

import AutocompleteAddressForm from "@/shared/components/(user)/AutoCompleteForm/autoCompleteForm";
import { InputPhone } from "@/shared/components/(common)/ui/input-phone";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { Toaster } from "@/shared/components/(common)/ui/toaster";

const ADD_CUSTOMER_ADDRESS = gql`
  mutation AddCustomerAddress(
    $region: CustomerAddressRegionInput!
    $country_code: CountryCodeEnum!
    $street: [String!]!
    $telephone: String!
    $postcode: String!
    $city: String!
    $firstname: String!
    $lastname: String!
    $company: String!
    $default_shipping: Boolean!
    $default_billing: Boolean!
  ) {
    createCustomerAddress(
      input: {
        region: $region
        country_code: $country_code
        street: $street
        telephone: $telephone
        postcode: $postcode
        city: $city
        firstname: $firstname
        lastname: $lastname
        company: $company
        default_shipping: $default_shipping
        default_billing: $default_billing
      }
    ) {
      id
      region {
        region
        region_code
      }
      country_code
      street
      telephone
      postcode
      city
      default_shipping
      default_billing
    }
  }
`;

/**
 * Handles adding a new customer address by managing form submissions and state updates.
 * @example
 * handleSubmit(event)
 * void
 * @param {Event} e - The form submission event captured to prevent default behavior.
 * @returns {void} Handles form submission and triggers mutations to add an address.
 * @description
 *   - Uses Apollo Client's useMutation for the ADD_CUSTOMER_ADDRESS mutation.
 *   - Updates address fields using React useState hooks.
 *   - Provides user feedback through toast notifications.
 *   - Redirects to the address page upon successful address addition.
 */
const AddAddress = () => {
  const { t, i18n } = useTranslation();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [company, setCompany] = useState("");
  const [telephone, setTelephone] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [street, setStreet] = useState([""]);
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [region, setRegion] = useState("");
  const [regionId, setRegionId] = useState("");
  const { toast } = useToast();

  const router = useRouter();

  const [addAddress, { loading: addAddressLoading, error, data }] =
    useMutation(ADD_CUSTOMER_ADDRESS);

  /**
   * Handles the form submission to add a new address for the user.
   * @example
   * handleSubmit(event)
   * // Prevents default form submission and adds the address using provided variables.
   * @param {Object} e - The event object from the form submission.
   * @returns {void} This function does not return a value.
   * @description
   *   - Prevents the default form submission behavior.
   *   - Adds a new address using the specified variables.
   *   - Shows a success toast notification upon successful address save.
   *   - Throws an error if the address save fails.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    addAddress({
      variables: {
        region: {
          region: region,
          region_id: regionId,
        },
        company,
        country_code: countryCode,
        street,
        telephone,
        postcode: postcode,
        city,
        firstname,
        lastname,
        default_shipping: defaultShipping,
        default_billing: defaultBilling,
      },
    })
      .then(() => {
        toast({ type: "success", description: t("You saved the address.") });
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleNewShipAddress = (data) => {
    setCountryCode(data?.country);
    setStreet(data?.street);
    setRegion(data?.region);
    setRegionId(data?.region_id);
    setPostcode(data?.postcode);
    setCity(data?.city);
  };

  const changePinCode = (value) => {
    setPostcode(value);
  };

  useEffect(() => {
    if (error)
      toast({
        type: "error",
        description: t("Something went wrong. Please, try again later."),
      });
  }, [error, toast]);

  return (
    <div className="w-full min-h-full bg-whitesmoke-100 overflow-hidden tracking-[normal] text-left text-11xl font-sf-pro-display p-6">
      <Header className="md:hidden" title="New Address" />
      <main className="w-full bg-white rounded-md shadow-sm">
        <div className="px-6 py-6">
          <Header className="max-md:hidden" title="New Address" />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="">
              <div className="flex items-end">
                <h3 className="mt-0 relative text-lg font-bold text-[#495057] font-inherit inline-block">
                  <Trans t={t}>Contact Information</Trans>
                </h3>
                <div className="grow h-[1px] bg-[#CED4DA] mb-[0.8em] ml-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                <div className="w-full">
                  <label
                    className="block text-base text-[#434345] mb-1"
                    htmlFor="firstname"
                  >
                    <Trans t={t}>First Name</Trans>
                    <span className="text-[#F25353] ml-1">*</span>
                  </label>
                  <input
                    required
                    className="block w-full rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2.5"
                    id="firstname"
                    placeholder={t("Firstname")}
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-base text-[#434345] mb-1"
                    htmlFor="lastname"
                  >
                    <Trans t={t}>Last Name</Trans>
                    <span className="text-[#F25353] ml-1">*</span>
                  </label>
                  <input
                    required
                    className="block w-full rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2.5"
                    id="lastname"
                    placeholder={t("Lastname")}
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-base text-[#434345] mb-1"
                    htmlFor="company"
                  >
                    <Trans t={t}>Company Name</Trans>
                  </label>
                  <input
                    required
                    className="block w-full rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2.5"
                    id="company"
                    placeholder={t("Company")}
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-base text-[#434345] mb-1"
                    htmlFor="telephone"
                  >
                    <Trans t={t}>Phone No.</Trans>
                  </label>

                  <InputPhone
                    className="border-0 py-0 px-0"
                    countrySelectorStyleProps={{
                      buttonClassName:
                        "!border-0 !h-[100%] flex !items-center !bg-white",
                    }}
                    id="telephone"
                    inputProps={{
                      className:
                        "w-full border-y-1 border-[#CED4DA] rounded focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-300 flex-grow py-2.5",
                    }}
                    placeholder="(xxx) xxx-xxxx"
                    value={telephone}
                    onChange={setTelephone}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <section className={"bg-white gap-5 py-7"}>
                <div className="flex items-end">
                  <p className="text-lg text-[#495057] font-bold">
                    <Trans t={t}>Address</Trans>
                  </p>
                  <div className="grow h-[1px] bg-[#CED4DA] mb-[0.8em] ml-2" />
                </div>
                <AutocompleteAddressForm
                  callback={handleNewShipAddress}
                  changePinCode={changePinCode}
                  profilePage={true}
                />
              </section>

              <div className="mt-0 md:mt-4 w-full md:w-1/2">
                <div className="w-full md:p-7 bg-white rounded-[5px]">
                  <div className="flex items-center">
                    <input
                      checked={defaultShipping}
                      className="h-5 w-5 text-blue-600 focus:ring-transparent border-gray-300 rounded"
                      id="defaultShipping"
                      type="checkbox"
                      onChange={(e) => setDefaultShipping(e.target.checked)}
                    />
                    <label
                      className="ml-2 block text-sm md:text-base text-gray-900"
                      htmlFor="defaultShipping"
                    >
                      <Trans t={t}>Use as my default Shipping Address</Trans>
                    </label>
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      checked={defaultBilling}
                      className="h-5 w-5 text-blue-600 focus:ring-transparent border-gray-300 rounded"
                      id="defaultBilling"
                      type="checkbox"
                      onChange={(e) => setDefaultBilling(e.target.checked)}
                    />
                    <label
                      className="ml-2 block text-sm md:text-base text-gray-900"
                      htmlFor="defaultBilling"
                    >
                      <Trans t={t}>Use as my default Billing Address</Trans>
                    </label>
                  </div>
                  <div className="flex justify-start mt-5">
                    <SaveButton loading={addAddressLoading} />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {}
          {data && router.push("/customer/dashboard/my-address")}
          <Toaster position="bottom-right" reverseOrder={false} />
        </div>
      </main>
    </div>
  );
};

export default AddAddress;
