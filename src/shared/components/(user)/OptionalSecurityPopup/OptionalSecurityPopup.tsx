"use client";

import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/(common)/ui/dialog";
import { Checkbox } from "@/shared/components/(common)/ui/checkbox";
import { Button } from "@/shared/components/(common)/ui/button";

export const AUTH_REMINDER_LS_KEY = "hideAuthReminder";

const OptionalSecurityPopup: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hideReminder, setHideReminder] = useState(false);

  const saveChoice = () => {
    if (hideReminder)
      localStorage.setItem(AUTH_REMINDER_LS_KEY, Date.now().toString());
  };
  const closeDialog = () => {
    saveChoice();
    setIsOpen(false);
  };
  const handleCheckboxChanged = () =>
    setHideReminder((prevState) => !prevState);
  const handleContinue = () => {
    saveChoice();
    router.push("/customer/dashboard/my-account/login-security");
  };

  useEffect(() => {
    const shouldShowReminder = !localStorage.getItem(AUTH_REMINDER_LS_KEY);

    if (shouldShowReminder) setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent
        className="rounded-sm w-4/5 sm:w-full sm:max-w-[445px] p-8 gap-0"
        showCloseBtn={false}
      >
        <DialogHeader>
          <div className="flex gap-2.5 items-center">
            <DialogClose>
              <div className="absolute -top-5 -right-5">
                <svg
                  fill="none"
                  height="47"
                  viewBox="0 0 47 47"
                  width="47"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="23.5" cy="23.5" fill="#F46A6A" r="23.5" />
                  <path
                    d="M33.6831 13.3167L13.3164 33.6833"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M13.3164 13.3167L33.6831 33.6833"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </DialogClose>
          </div>
        </DialogHeader>
        <DialogTitle className="font-[500] gap-2 inline-flex items-center justify-center text-xl text-[#434345] tracking-tight pt-1 pb-6">
          <svg
            fill="none"
            height="50"
            viewBox="0 0 50 50"
            width="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="25"
              cy="25"
              r="24.5"
              stroke="#00C0F3"
              strokeOpacity="0.5"
            />
            <circle cx="25" cy="25" fill="#00C0F3" r="21" />
            <path
              d="M32.875 36.125H17.125C16.4288 36.125 15.7611 35.8484 15.2688 35.3562C14.7766 34.8639 14.5 34.1962 14.5 33.5V23.875C14.5 23.1788 14.7766 22.5111 15.2688 22.0188C15.7611 21.5266 16.4288 21.25 17.125 21.25H32.875C33.5712 21.25 34.2389 21.5266 34.7312 22.0188C35.2234 22.5111 35.5 23.1788 35.5 23.875V33.5C35.5 34.1962 35.2234 34.8639 34.7312 35.3562C34.2389 35.8484 33.5712 36.125 32.875 36.125ZM17.125 23C16.8929 23 16.6704 23.0922 16.5063 23.2563C16.3422 23.4204 16.25 23.6429 16.25 23.875V33.5C16.25 33.7321 16.3422 33.9546 16.5063 34.1187C16.6704 34.2828 16.8929 34.375 17.125 34.375H32.875C33.1071 34.375 33.3296 34.2828 33.4937 34.1187C33.6578 33.9546 33.75 33.7321 33.75 33.5V23.875C33.75 23.6429 33.6578 23.4204 33.4937 23.2563C33.3296 23.0922 33.1071 23 32.875 23H17.125Z"
              fill="white"
            />
            <path
              d="M32 23H18C17.7679 23 17.5454 22.9078 17.3813 22.7437C17.2172 22.5796 17.125 22.3571 17.125 22.125V16.875C17.125 15.0185 17.8625 13.238 19.1753 11.9253C20.488 10.6125 22.2685 9.875 24.125 9.875H25.875C27.7315 9.875 29.512 10.6125 30.8247 11.9253C32.1375 13.238 32.875 15.0185 32.875 16.875V22.125C32.875 22.3571 32.7828 22.5796 32.6187 22.7437C32.4546 22.9078 32.2321 23 32 23ZM18.875 21.25H31.125V16.875C31.125 15.4826 30.5719 14.1473 29.5873 13.1627C28.6027 12.1781 27.2674 11.625 25.875 11.625H24.125C22.7326 11.625 21.3973 12.1781 20.4127 13.1627C19.4281 14.1473 18.875 15.4826 18.875 16.875V21.25Z"
              fill="white"
            />
            <path
              d="M25 29.125C24.6539 29.125 24.3155 29.0224 24.0278 28.8301C23.74 28.6378 23.5157 28.3645 23.3832 28.0447C23.2508 27.7249 23.2161 27.3731 23.2836 27.0336C23.3512 26.6941 23.5178 26.3823 23.7626 26.1376C24.0073 25.8928 24.3191 25.7262 24.6586 25.6586C24.9981 25.5911 25.3499 25.6258 25.6697 25.7582C25.9895 25.8907 26.2628 26.115 26.4551 26.4028C26.6474 26.6905 26.75 27.0289 26.75 27.375C26.75 27.8391 26.5656 28.2842 26.2374 28.6124C25.9092 28.9406 25.4641 29.125 25 29.125Z"
              fill="white"
            />
            <path d="M25.875 28.25H24.125V31.75H25.875V28.25Z" fill="white" />
          </svg>
          <span>
            <Trans t={t}>Optional Security</Trans>
          </span>
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[#434345] text-lg font-light">
              <Trans t={t}>Enable 2FA</Trans>
            </div>
            <div className="text-[#74788D] font-light text-[13px]">
              <Trans t={t}>
                Add an extra layer of security to your account, after entering
                password, through a one time code sent to your phone.
              </Trans>
            </div>
          </div>
          <div>
            <div className="text-[#434345] text-lg font-light">
              <Trans t={t}>Add a Recovery Email</Trans>
            </div>
            <div className="text-[#74788D] font-light text-[13px]">
              <Trans t={t}>
                Set a recovery email so we can reach you in case we detect
                unusual activity in your account or you accidentally get locked
                out of your account.
              </Trans>
            </div>
          </div>
          <div>
            <div className="text-[#434345] text-lg font-light">
              <Trans t={t}>Add a Phone</Trans>
            </div>
            <div className="text-[#74788D] font-light text-[13px]">
              <Trans t={t}>
                Add a phone number to your account so we can reach you in case
                we detect unusual activity in your account or you accidentally
                get locked out of your account.
              </Trans>
            </div>
          </div>
          <div className="flex flex-wrap items-center mt-2">
            <Checkbox
              className={"rounded-[5px] border-[#ced4da]"}
              id="hide-remider"
              onCheckedChange={handleCheckboxChanged}
            />
            <label
              className="cursor-pointer text-[#434345] text-lg font-light ml-2"
              htmlFor="hide-remider"
            >
              <Trans t={t}>Hide Reminder</Trans>
            </label>
            <div className="text-sm font-light text-[#74788D] flex-[100%]">
              <strong>
                <Trans t={t}>Note</Trans>:{" "}
              </strong>
              <Trans t={t}>
                You can access this from security settings in future
              </Trans>
            </div>
          </div>
        </div>
        <DialogFooter
          className={"flex-col sm:flex-col items-center gap-2.5 pt-8"}
        >
          <Button
            className="w-full max-w-[180px] rounded-[50px] py-2 text-white text-base font-medium bg-blue"
            type="submit"
            onClick={handleContinue}
          >
            <Trans t={t}>Continue</Trans>
          </Button>
          <Button
            className="p-0 !m-0 h-auto text-blue text-[15px]"
            type="button"
            variant={"link"}
            onClick={closeDialog}
          >
            <Trans t={t}>Maybe Later</Trans> -
            <strong className={'before:content-["\\00a0"]'}>
              <Trans t={t}>Skip</Trans>
            </strong>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OptionalSecurityPopup;
