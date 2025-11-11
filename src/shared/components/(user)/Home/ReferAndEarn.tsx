import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import useReferralFactoryConfig from "@/hooks/useReferralFactoryConfig";
import Title from "@/shared/components/(common)/Title/Title";
const siteUrl = process.env.NEXT_PUBLIC_REFERRAL_LINK_DOMAIN;

type UseToastReturn = {
  toast: (args: any) => void;
};

type UseReferralFactoryConfigReturn = {
  data: {
    code: string;
  };
};

/**
 * Creates a referral link along with social media sharing options.
 * It allows users to copy their unique referral link and share it via various social media platforms.
 * @example
 * return <ReferAndEarn />
 * @returns {React.JSX.Element} The rendered JSX for the "Refer and Earn" section.
 * @description
 *   - Uses hooks like useState to manage referral link and its copied state.
 *   - Utilizes useEffect to update the referral link once the configuration is loaded.
 *   - Supports clipboard copy functionality with a toast notification for copy success.
 *   - Renders social share buttons to promote referral links across multiple platforms.
 */
const ReferAndEarn: FC = (): React.JSX.Element => {
  const { data: referralConfig } =
    useReferralFactoryConfig() as UseReferralFactoryConfigReturn;
  const [referralLink, setReferralLink] = useState<null | string>(null);
  const { toast } = useToast() as UseToastReturn;
  const { t } = useTranslation();
  const [hasRefCopied, setHasRefCopied] = useState(false);

  useEffect(() => {
    if (referralConfig?.code)
      setReferralLink(
        (siteUrl ? siteUrl : "") + "refer/" + referralConfig.code,
      );
  }, [referralConfig]);

  /**
   * Copies the referral link to the clipboard and displays a success message.
   * @example
   * copyReferralLink()
   * // Copies the referral link and triggers a success toast notification.
   * @param {string} referralLink - The referral link URL to copy.
   * @returns {void} No return value.
   * @description
   *   - Utilizes the Clipboard API if available, else falls back to a manual copy method using a textarea.
   *   - Updates a state to indicate the link has been copied and triggers a success toast notification.
   *   - Resets the copied state after two seconds to allow for new copy actions.
   */
  const copyToClipboard = () => {
    if (referralLink !== null) {
      /* eslint-disable no-undef */
      if (navigator.clipboard) {
        navigator.clipboard.writeText(referralLink);
      } else {
        const input = document.createElement("textarea");

        input.value = referralLink;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      /* eslint-enable no-undef */
    }

    setHasRefCopied(true);
    toast({ type: "success", description: "Copied Successfully!" });
    setTimeout(() => {
      setHasRefCopied(false);
    }, 2000);
  };

  return (
    <>
      <Title className="text-paragraph mb-1 text-white">{t("Refer and Earn")}</Title>
      <div className="mt-1 text-base md:text-lg text-slategray-400 max-md:max-w-full text-white">
        {t("Earn credits towards next purchase for every successful refer")}
      </div>
      <div className="flex gap-3.5 items-center mt-3 text-slategray-400 text-base md:text-lg">
        <svg
          fill="none"
          height="20"
          viewBox="0 0 4 20"
          width="4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2V18"
            stroke="#00C0F3"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <div className="flex-auto text-white">{t("Unique Referral Link")}</div>
      </div>
      <div className="flex justify-between gap-5 pl-6 mt-3 w-full text-base bg-white border border-gray-300 border-solid shadow-sm rounded-[8px] max-md:pl-5 max-md:max-w-full">
        <input
          readOnly
          aria-label="Referral Link"
          className="w-full flex-auto bg-transparent border-none focus:outline-none focus:ring-0 text-[#8080806B] placeholder:text-[#8080806B]"
          type="text"
          placeholder="https://dev.fur4.com/?referral={code}"
          value={referralLink ? referralLink : ""}
        />
        <button
          className="flex justify-center items-center min-w-10 md:min-w-[131px] gap-2 py-2.5 font-medium text-white bg-[#6A1CF0] border border-solid border-[#6A1CF0] rounded-[8px]"
          onClick={copyToClipboard}
        >
          <span className="hidden md:block">
            {hasRefCopied ? t("Subscribed!") : t("Subscribe")}
          </span>
        </button>
      </div>
      {referralLink ? (
        <div className="flex gap-4 items-center mt-7">
          <FacebookShareButton url={referralLink}>
            <svg
              fill="none"
              height="38"
              viewBox="0 0 38 38"
              width="38"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M37.9806 18.9903C37.9806 8.50225 29.4784 0 18.9903 0C8.50225 0 0 8.50225 0 18.9903C0 28.4689 6.94452 36.3253 16.0231 37.7499V24.4797H11.2013V18.9903H16.0231V14.8065C16.0231 10.0471 18.8582 7.41809 23.196 7.41809C25.2737 7.41809 27.4469 7.789 27.4469 7.789V12.4624H25.0523C22.6933 12.4624 21.9576 13.9262 21.9576 15.428V18.9903H27.2244L26.3825 24.4797H21.9576V37.7499C31.0362 36.3253 37.9806 28.4689 37.9806 18.9903Z"
                fill="#1877F2"
              />
              <path
                d="M26.3813 24.4797L27.2233 18.9903H21.9564V15.428C21.9564 13.9262 22.6921 12.4624 25.0512 12.4624H27.4458V7.78903C27.4458 7.78903 25.2725 7.41812 23.1949 7.41812C18.8571 7.41812 16.022 10.0471 16.022 14.8065V18.9903H11.2002V24.4797H16.022V37.75C16.9888 37.9017 17.9797 37.9807 18.9892 37.9807C19.9986 37.9807 20.9896 37.9017 21.9564 37.75V24.4797H26.3813Z"
                fill="white"
              />
            </svg>
          </FacebookShareButton>
          <WhatsappShareButton
            className="Demo__some-network__share-button"
            separator=":: "
            title={"WhatsApp"}
            url={referralLink}
          >
            <svg
              fill="none"
              height="38"
              viewBox="0 0 38 38"
              width="38"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9903 37.9806C8.50387 37.9806 0 29.4768 0 18.9903C0 8.50387 8.50387 0 18.9903 0C29.4768 0 37.9806 8.50387 37.9806 18.9903C37.9806 29.4768 29.4768 37.9806 18.9903 37.9806Z"
                fill="#25D366"
              />
              <path
                clipRule="evenodd"
                d="M27.8705 10.1484C25.5157 7.78978 22.3785 6.49084 19.04 6.48705C12.1617 6.48705 6.55958 12.0854 6.55958 18.9675C6.55958 21.1666 7.13309 23.3163 8.22693 25.2077L6.45703 31.6758L13.0733 29.9401C14.8963 30.9352 16.9473 31.4593 19.0362 31.4593H19.04C25.9183 31.4593 31.5167 25.861 31.5205 18.9789C31.5243 15.6442 30.2291 12.507 27.8705 10.1484ZM19.0438 29.3514H19.04C17.179 29.3514 15.3521 28.85 13.7607 27.9043L13.3809 27.6802L9.4537 28.7095L10.502 24.8811L10.2551 24.4899C9.21822 22.8377 8.6675 20.9311 8.6675 18.9675C8.6713 13.2476 13.3239 8.59497 19.0476 8.59497C21.8202 8.59497 24.4219 9.67742 26.3817 11.6372C28.3415 13.597 29.4201 16.2063 29.4163 18.9751C29.4163 24.6988 24.7599 29.3514 19.0438 29.3514ZM24.7333 21.5806C24.4219 21.4248 22.8875 20.669 22.6026 20.5665C22.3177 20.4639 22.1089 20.4107 21.9 20.7222C21.6911 21.0336 21.0948 21.7363 20.9125 21.9452C20.7302 22.1541 20.5478 22.1806 20.2364 22.0249C19.925 21.8692 18.9185 21.5388 17.7297 20.4753C16.803 19.6473 16.1763 18.6257 15.994 18.3142C15.8117 18.0028 15.975 17.8319 16.1307 17.6761C16.2712 17.5356 16.4421 17.3115 16.5979 17.1292C16.7536 16.9469 16.8068 16.8178 16.9093 16.6089C17.0119 16.4 16.9625 16.2177 16.8827 16.062C16.803 15.9062 16.1801 14.3718 15.9218 13.7451C15.6673 13.1375 15.4129 13.221 15.2192 13.2096C15.0369 13.202 14.828 13.1982 14.6229 13.1982C14.414 13.1982 14.0759 13.278 13.7911 13.5894C13.5062 13.9009 12.701 14.6567 12.701 16.1911C12.701 17.7255 13.8177 19.2106 13.9734 19.4157C14.1291 19.6245 16.1725 22.7731 19.3021 24.1253C20.0465 24.4481 20.6276 24.638 21.0796 24.7823C21.8278 25.0216 22.5076 24.9874 23.0432 24.9077C23.6433 24.8165 24.889 24.1518 25.1473 23.4264C25.4056 22.6972 25.4056 22.0743 25.3296 21.9452C25.2536 21.816 25.0448 21.7401 24.7333 21.5806Z"
                fill="white"
                fillRule="evenodd"
              />
            </svg>
          </WhatsappShareButton>
          <EmailShareButton url={referralLink}>
            <svg
              fill="none"
              height="38"
              viewBox="0 0 38 38"
              width="38"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M18.99 37.98C29.4779 37.98 37.98 29.4779 37.98 18.99C37.98 8.50211 29.4779 0 18.99 0C8.50211 0 0 8.50211 0 18.99C0 29.4779 8.50211 37.98 18.99 37.98Z"
                fill="#F14336"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M18.9899 21.1812L29.9456 11.6862H8.0341L18.9899 21.1812ZM16.0307 20.1301L18.9899 22.559L21.9027 20.1301L29.9456 27.0242H8.0341L16.0307 20.1301ZM7.30371 26.2938V12.4165L15.3379 19.3552L7.30371 26.2938ZM30.676 26.2938V12.4165L22.6418 19.3552L30.676 26.2938Z"
                fill="white"
                fillRule="evenodd"
              />
            </svg>
          </EmailShareButton>
          <LinkedinShareButton url={referralLink}>
            <svg
              fill="none"
              height="38"
              viewBox="0 0 38 38"
              width="38"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.99 37.98C29.4779 37.98 37.98 29.4779 37.98 18.99C37.98 8.50211 29.4779 0 18.99 0C8.50211 0 0 8.50211 0 18.99C0 29.4779 8.50211 37.98 18.99 37.98Z"
                fill="#007BB5"
              />
              <path
                d="M13.0551 13.0556H8.30762V29.6718H13.0551V13.0556Z"
                fill="white"
              />
              <path
                d="M24.3291 13.0556C21.0165 13.0556 20.4468 14.2638 20.1762 15.4293V13.0556H15.4287V29.6718H20.1762V20.1768C20.1762 18.6375 21.0106 17.8031 22.55 17.8031C24.0525 17.8031 24.9237 18.6197 24.9237 20.1768V29.6718H29.6712V21.3637C29.6712 16.6162 29.0528 13.0556 24.3291 13.0556Z"
                fill="white"
              />
              <path
                d="M10.6814 11.8687C11.9924 11.8687 13.0551 10.806 13.0551 9.49497C13.0551 8.18398 11.9924 7.12122 10.6814 7.12122C9.37038 7.12122 8.30762 8.18398 8.30762 9.49497C8.30762 10.806 9.37038 11.8687 10.6814 11.8687Z"
                fill="white"
              />
            </svg>
          </LinkedinShareButton>
          <TwitterShareButton url={referralLink}>
            <svg
              fill="none"
              height="38"
              viewBox="0 0 38 38"
              width="38"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9903 37.9806C8.50387 37.9806 0 29.4768 0 18.9903C0 8.50387 8.50387 0 18.9903 0C29.4768 0 37.9806 8.50387 37.9806 18.9903C37.9806 29.4768 29.4768 37.9806 18.9903 37.9806Z"
                fill="black"
              />
              <mask
                height="20"
                id="mask0_6203_504"
                maskUnits="userSpaceOnUse"
                style={{ maskType: "luminance" }}
                width="20"
                x="9"
                y="9"
              >
                <path
                  d="M28.1573 9.16772H9.16699V28.5801H28.1573V9.16772Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_6203_504)">
                <path
                  d="M20.4688 17.3833L27.5384 9.16772H25.8631L19.7246 16.3012L14.8218 9.16772H9.16699L16.581 19.9548L9.16699 28.5701H10.8423L17.3248 21.0369L22.5025 28.5701H28.1573L20.4684 17.3833H20.4688ZM18.1742 20.0498L17.423 18.9757L11.446 10.4286H14.0193L18.8427 17.3264L19.5939 18.4005L25.8639 27.3666H23.2907L18.1742 20.0502V20.0498Z"
                  fill="white"
                />
              </g>
            </svg>
          </TwitterShareButton>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ReferAndEarn;
