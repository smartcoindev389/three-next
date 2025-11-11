import React, { FC } from "react";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { cn } from "@/utils/cn";
import Title from "@/shared/components/(common)/Title/Title";

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = ({ className }): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <p className={cn(`${className}`, `pb-6 b-8 flex items-center`)}>
      <Title className="text-paragraph text-[1.75rem] pr-2 sm:pr-5 shrink-0">
        <Trans t={t}>Add New Card</Trans>
      </Title>
      <Link
        className="flex items-center gap-1.5"
        href="/customer/dashboard/payments/methods"
      >
        <svg
          fill="none"
          height="14"
          viewBox="0 0 14 14"
          width="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 6.125H3.35125L8.2425 1.23375L7 0L0 7L7 14L8.23375 12.7663L3.35125 7.875H14V6.125Z"
            fill="#00C0F3"
          />
        </svg>
        <span className="text-deepskyblue-100">
          <Trans t={t}>Back to Payment Methods</Trans>
        </span>
      </Link>
    </p>
  );
};

export default Header;
