import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useState } from "react";

interface CardItemProps {
  type: string;
  lastNumber: string;
  isDefault: boolean;
  label: string;
  id: string;
  handleDelete: any;
  handleDefault: any;
  icon: string;
  brand: string;
}

const CardItem: FC<CardItemProps> = ({
  type,
  lastNumber,
  isDefault,
  label,
  id,
  handleDelete,
  handleDefault,
  icon,
  brand,
}) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(false);

  const onDeleteClick = async () => {
    setLoading(true);
    await handleDelete(id);
    setLoading(false);
  };

  const onDefaultUpdate = () => {
    setDefaultLoading(true);
    handleDefault(id);
  };

  return (
    <div
      key={id}
      className="w-full flex flex-wrap flex-row gap-3 justify-between md:items-center pl-5 pr-8 py-[16px] rounded-sm border border-[#CED4DA] shadow"
    >
      <div className="flex items-center gap-6">
        <img alt={brand} className="w-[30px] md:w-[90px]" src={icon} />
        <div className="text-sm md:text-lg text-[#545454]">{label}</div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {isDefault ? (
          <div className="text-sm md:text-base font-medium text-blue">
            <Trans t={t}>Default</Trans>
          </div>
        ) : (
          <button
            aria-label={t("Make Default")}
            className="flex items-center text-sm text-[#495057] gap-1"
            onClick={onDefaultUpdate}
          >
            <svg
              fill="none"
              height="14"
              viewBox="0 0 14 14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M3.63461 0.134271L3.50034 0.268487V1.88444V3.50034H1.88444H0.268487L0.134271 3.63461C0.00787575 3.761 0 3.80432 0 4.37542C0 4.94855 0.0074929 4.98951 0.135911 5.11793L0.271823 5.25384L2.64986 5.23853C4.84747 5.22431 5.03534 5.21577 5.12553 5.12553C5.21577 5.03534 5.22431 4.84747 5.23853 2.64986L5.25384 0.271823L5.11793 0.135911C4.98951 0.0074929 4.94855 0 4.37542 0C3.80432 0 3.761 0.00787575 3.63461 0.134271ZM8.88511 0.134271L8.75084 0.268487V2.62525V4.98202L8.88675 5.11793L9.02266 5.25384L11.4007 5.23853C13.5987 5.22431 13.7861 5.21577 13.8764 5.12548C13.9593 5.04256 13.974 4.92842 13.974 4.36864C13.974 3.43235 14.1199 3.50034 12.1107 3.50034H10.5056L10.4896 1.85463L10.4737 0.208981L10.3445 0.104463C10.235 0.0158609 10.1246 0 9.61739 0C9.05532 0 9.01123 0.00809453 8.88511 0.134271ZM0.134271 8.88511C0.00809453 9.01123 0 9.05532 0 9.61739C0 10.1246 0.0158609 10.235 0.104463 10.3445L0.208981 10.4737L1.85463 10.4896L3.50034 10.5056V12.1107C3.50034 14.1199 3.43235 13.974 4.36864 13.974C4.92842 13.974 5.04256 13.9593 5.12548 13.8764C5.21577 13.7861 5.22431 13.5987 5.23853 11.4007L5.25384 9.02266L5.11793 8.88675L4.98202 8.75084H2.62525H0.268487L0.134271 8.88511ZM8.88511 8.88511L8.75084 9.01933V11.3761V13.7329L8.88976 13.8718C9.0248 14.0068 9.04585 14.0102 9.65365 13.9923C10.1642 13.9773 10.2965 13.9561 10.3761 13.8764C10.4646 13.7879 10.4751 13.6267 10.4896 12.1422L10.5056 10.5056L12.1422 10.4896C13.6267 10.4751 13.7879 10.4646 13.8764 10.3761C13.9561 10.2965 13.9773 10.1642 13.9923 9.65365C14.0102 9.04585 14.0068 9.0248 13.8718 8.88976L13.7329 8.75084H11.3761H9.01933L8.88511 8.88511Z"
                fill="#00C0F3"
                fillRule="evenodd"
              />
            </svg>
            {defaultLoading ? t("Updating...") : t("Make Default")}
          </button>
        )}
        <button
          aria-label={t("Delete")}
          className="flex items-center text-sm text-[#495057] gap-1"
          disabled={loading}
          onClick={onDeleteClick}
        >
          <svg
            fill="none"
            height="14"
            viewBox="0 0 11 14"
            width="11"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.760417 12.4444C0.760417 13.3 1.44479 14 2.28125 14H8.36458C9.20104 14 9.88542 13.3 9.88542 12.4444V3.11111H0.760417V12.4444ZM2.63104 6.90667L3.70323 5.81L5.32292 7.45889L6.935 5.81L8.00719 6.90667L6.3951 8.55556L8.00719 10.2044L6.935 11.3011L5.32292 9.65222L3.71083 11.3011L2.63865 10.2044L4.25073 8.55556L2.63104 6.90667ZM7.98438 0.777778L7.22396 0H3.42188L2.66146 0.777778H0V2.33333H10.6458V0.777778H7.98438Z"
              fill="#F46A6A"
            />
          </svg>
          {loading ? t("Deleting...") : t("Delete")}
        </button>
      </div>
    </div>
  );
};

export default CardItem;
