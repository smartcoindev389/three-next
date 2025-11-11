import { useTranslation } from "react-i18next";
import { FC, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useQuery } from "@apollo/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

import Avatar from "@/shared/components/(user)/Avatar/Avatar";
import { GET_ACCOUNT_DATA } from "@/lib/apollo/queryes/customer";
import { getCustomerCustomAttribute } from "@/utils/utils-old";
import { AUTH_REMINDER_LS_KEY } from "@/shared/components/(user)/OptionalSecurityPopup/OptionalSecurityPopup";

const baseClassName =
  "block rounded w-full text-start px-4 py-[6.5px] text-[13px] text-body-color hover:bg-gray-2 hover:text-primary border-[#EBEBEB] border-b-[1px] last:border-0";

const AccountMenu: FC = () => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_ACCOUNT_DATA);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });

    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const shouldUse2fa = getCustomerCustomAttribute(data?.customer, "two_factor_authentication") === "1";

    if (!data || shouldUse2fa) localStorage.setItem(AUTH_REMINDER_LS_KEY, Date.now().toString());
  }, [data]);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="outline-0 flex cursor-pointer items-center">
        <Avatar
          className="h-9 w-9 border-2 border-white border-opacity-20"
          customerData={data?.customer}
          loading={loading}
          size={36}
        />
        <span className="pl-[10px] pr-[5px] text-sm font-medium text-[#555B6D]">{data?.customer?.firstname}</span>
        <svg
          aria-hidden="true"
          className="ml-1"
          fill="none"
          height="14"
          viewBox="0 0 15 14"
          width="15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.63535 9.97501C7.5041 9.97501 7.39473 9.93126 7.28535 9.84376L2.2541 4.90001C2.05723 4.70314 2.05723 4.39689 2.2541 4.20001C2.45098 4.00314 2.75723 4.00314 2.9541 4.20001L7.63535 8.77189L12.3166 4.15626C12.5135 3.95939 12.8197 3.95939 13.0166 4.15626C13.2135 4.35314 13.2135 4.65939 13.0166 4.85626L7.98535 9.80001C7.87598 9.90939 7.7666 9.97501 7.63535 9.97501Z"
            fill="#555B6D"
          />
        </svg>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        className="p-0 w-[200px] rounded-[4px] border border-[#EBEBEB] bg-white pt-[3px] pb-[6px] shadow-md"
      >
        <DropdownMenu.Item>
          <Link aria-label={t("Account Information")} className={baseClassName} href="/customer/dashboard/my-account">
            {t("Account Information")}
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Link
            aria-label={t("Login and Security")}
            className={baseClassName}
            href="/customer/dashboard/my-account/login-security"
          >
            {t("Login and Security")}
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <button className={baseClassName} onClick={handleLogout}>
            {t("Logout")}
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AccountMenu;
