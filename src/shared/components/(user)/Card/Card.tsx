"use client";

import { FC, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import Link from "next/link";

import Title from "@/shared/components/(common)/Title/Title";

interface CardData {
  className?: string;
  title: string;
  content: ReactNode;
  icon: ReactNode;
  link: string;
}

const Card: FC<CardData> = ({ className = "", icon, title, content, link }) => {
  const { t } = useTranslation();

  return (
    <Link
      className={`${className} p-5 xl:px-12 xl:py-10 rounded-[20px] border border-solid border-[#97E3FF59] bg-gradient-to-r from-[#001322] to-[#004C88] flex items-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] gap-5 md:gap-10 w-full sm:h-40`}
      href={link}
    >
      <div className="w-[75px] h-[75px]">{icon}</div>
      <div className="flex flex-col text-white">
        <Title className="text-paragraph">
          <Trans t={t}>{title}</Trans>
        </Title>
        <div className="text-sm md:text-lg font-medium text-white font-sf-pro-display">
          <Trans t={t}>{content}</Trans>
        </div>
      </div>
    </Link>
  );
};

export default Card;
