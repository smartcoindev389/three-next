import React, { FC } from "react";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";
import Image from "next/image";

import { cn } from "@/utils/cn";
import Title from "@/shared/components/(common)/Title/Title";

interface HeaderProps {
  className?: string;
  title: string;
}

const Header: FC<HeaderProps> = ({ className, title }): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={cn(`${className}`, `flex items-center gap-5 mb-4`)}>
      <Title className="text-paragraph text-[1.75rem] mt-0 pb-1 relative">
        <Trans t={t}>{title}</Trans>
      </Title>
      <Link
        className="flex items-center gap-2"
        href="/customer/dashboard/my-address"
      >
        <Image
          alt="Back to Addresses"
          height={14}
          src="/assets/arrow-back.svg"
          width={14}
        />
        <div className="text-sm font-[500] text-blue">
          {t("Back to Addresses")}
        </div>
      </Link>
    </div>
  );
};

export default Header;
