"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import {
  GET_CUSTOMER_ACCOUNT_DATA,
  UPDATE_CUSTOMER_PROFILE_IMAGE,
} from "@/lib/apollo/queryes/customer";
import { getCustomerCustomAttribute } from "@/utils/utils-old";
import Loader from "@/shared/components/(common)/Loader/Loader";
import { InputPhone } from "@/shared/components/(common)/ui/input-phone";
import {
  AccountInfoForm,
  ChangePasswordForm,
  DeleteAccountForm,
  NotificationsForm,
} from "@/shared/components/(user)/Forms";
import EditingImage from "@/assets/icons/pencil-alt.svg";
import Title from "@/shared/components/(common)/Title/Title";
import Avatar from "@/shared/components/(user)/Avatar/Avatar";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Displays and handles account information and settings for a customer.
 * @example
 * AccountInformation()
 * Renders the account information, profile image, and settings forms for the user.
 * @param none No parameters.
 * @returns {JSX.Element} A React component that renders the user's account information page.
 * @description
 *   - Handles updating the customer's profile image and refetching data on update.
 *   - Manages loading states for user data and image files.
 *   - Uses several hooks for data fetching and state management.
 *   - Incorporates localization support through the useTranslation hook.
 */
export default function AccountInformation() {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({});
  const [userImg, setUserImg] = useState("");
  const [fileLoading, setFileLoading] = useState(true);

  const {
    data,
    loading: dataLoading,
    refetch,
  } = useQuery(GET_CUSTOMER_ACCOUNT_DATA);

  const [updateCustomerProfileImage, { loading: updateFileLoading }] =
    useMutation(UPDATE_CUSTOMER_PROFILE_IMAGE);

  useEffect(() => {
    if (data?.customer) {
      setCustomerData(data?.customer);
    }
  }, [data]);

  useEffect(() => {
    const fileName = getCustomerCustomAttribute(customerData, "profile_pic");
    const url = `${baseURL}/media${fileName}`;

    setUserImg(url);

    if (loading) setLoading(false);
  }, [customerData]);

  useEffect(() => {
    if (dataLoading || updateFileLoading) return;
    setFileLoading(false);
  }, [userImg]);

  const _getPhone = () => {
    return getCustomerCustomAttribute(customerData, "phone_number");
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Handles file input change event to update the customer profile image.
   * @example
   * sync(event)
   * undefined
   * @param {Event} event - The file input change event containing the file to be processed.
   * @returns {void} Does not return any value.
   * @description
   *   - Converts the selected file to a Base64 string representation.
   *   - Updates the customer profile image using the Base64 string.
   *   - Displays an error message if the update fails.
   *   - Toggles file loading state during the update process.
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const videoBase64 = await toBase64(file);

    if (!videoBase64) return;

    const base64String = videoBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    setFileLoading(true);

    updateCustomerProfileImage({
      variables: {
        profile_url: base64String,
      },
    })
      .then((res) => {
        refetch();
      })
      .catch((err) => {
        toast({
          type: "error",
          description: t("Something went wrong. Please, try again later."),
        });
        setFileLoading(false);
      });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div className="flex w-full bg-[#F8F8FB] min-h-[calc(100vh-70px)]">
      <div className="pt-6 pb-12 px-5 sm:px-[50px] sm:py-[40px] min-h-full bg-white w-full">
        {loading || Object.keys(customerData).length === 0 ? (
          <Loader className={"h-full"} />
        ) : (
          <>
            <Title className="text-paragraph mt-0 mb-[30px]">
              {t("Account Information")}
            </Title>

            <div className={"flex items-center gap-6"}>
              <div className={"shrink-0 relative"}>
                <div
                  className={
                    "bg-white rounded-full overflow-hidden w-[140px] h-[140px]"
                  }
                >
                  <Avatar customerData={customerData} loading={fileLoading} />
                </div>

                <button
                  aria-label={t("Edit profile image")}
                  className={`bg-blue p-2.5 w-max rounded-full border border-white absolute bottom-1 right-1${fileLoading ? " opacity-50" : ""}`}
                  disabled={fileLoading}
                  onClick={handleImageClick}
                >
                  <Image
                    alt={t("Edit")}
                    height={16}
                    src={EditingImage}
                    width={16}
                  />
                </button>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleFileChange}
                />
              </div>

              <div
                className={
                  "flex flex-col text-lg font-medium text-[#434345] font-sf-pro-display"
                }
              >
                <div className={"font-din-condensed text-4xl"}>
                  {customerData?.firstname} {customerData?.lastname}
                </div>
                <div>{customerData?.email}</div>
                {_getPhone() && (
                  <InputPhone
                    className={"border-0 p-0"}
                    countrySelectorStyleProps={{
                      buttonClassName: "!hidden",
                    }}
                    disabled={true}
                    inputProps={{
                      className:
                        "border-0 p-0 w-full text-lg text-[#434345] focus:outline-none focus:ring-0 focus:shadow-none",
                    }}
                    value={_getPhone()}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-x-[50px] gap-y-10 mt-16">
              <div className={"flex flex-wrap gap-x-[10px] gap-y-4"}>
                <div className="flex flex-[100%] gap-x-1 items-end mb-4">
                  <Title className="text-paragraph mt-0 ">
                    {t("Edit Info")}
                  </Title>
                  <div className="border-[#DCDCDC] border-solid border-t flex-auto h-px mb-[0.9em]" />
                </div>

                <AccountInfoForm
                  classes="flex-[100%]"
                  customer={customerData}
                  customerPhone={_getPhone() || ""}
                  onInfoUpdated={refetch}
                />
              </div>

              <div className="flex flex-wrap gap-x-[10px] gap-y-4 md:max-w-[calc(50%-8px)] xl:max-w-[360px]">
                <div className="flex flex-[100%] gap-x-1 items-end mb-4">
                  <Title className="text-paragraph mt-0">
                    {t("Change Password")}
                  </Title>
                  <div className="border-[#DCDCDC] border-solid border-t flex-auto h-px mb-[0.9em]" />
                </div>

                <ChangePasswordForm classes="flex-[100%]" />
              </div>

              <div className={"flex flex-wrap gap-x-[10px] gap-y-4"}>
                <NotificationsForm
                  classes="flex-[100%]"
                  customer={customerData}
                  onNotificationsUpdated={refetch}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-[10px] gap-y-4 mt-[50px]">
              <DeleteAccountForm reloadCustomer={refetch} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
