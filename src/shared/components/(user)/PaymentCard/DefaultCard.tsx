import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";

interface DefaultCardProps {
  lastNumber: string;
  name: string;
  date: string;
  defaultCard: {
    icon: string;
    brand: string;
  };
}

/**
 * Render a payment card component with details.
 * @example
 * renderPaymentCard({ lastNumber: '1234', name: 'John Doe', date: '12/23', defaultCard: { icon: 'url', brand: 'Visa' } })
 * <div className='mt-3...'>
 * @param {Object} params - The function parameter object.
 * @param {string} params.lastNumber - The last four digits of the card number.
 * @param {string} params.name - The name of the cardholder.
 * @param {string} params.date - The expiration date of the card.
 * @param {Object} params.defaultCard - The object containing the default card's details.
 * @param {string} params.defaultCard.icon - The URL of the card's icon image.
 * @param {string} params.defaultCard.brand - The brand of the card (e.g., Visa, MasterCard).
 * @returns {JSX.Element} The JSX element representing the payment card component.
 * @description
 *   - Uses the `useTranslation` hook to fetch localized strings.
 *   - Displays a graphic representation of the default card.
 *   - Styling is applied using Tailwind CSS classes.
 */
const DefaultCard: FC<DefaultCardProps> = ({
  lastNumber,
  name,
  date,
  defaultCard,
}): React.JSX.Element => {
  const { t, i18n } = useTranslation();

  return (
    <div className="mt-3 rounded-sm border border-[#CED4DA] shadow p-4 flex flex-row md:items-center gap-[30px]">
      <div className="w-1/2 bg-[#556EE6] rounded-[8px] shadow w-48 sm:w-64 pt-2.5 pl-3 pb-4">
        <div className="flex">
          <div>
            <svg
              fill="none"
              height="22"
              viewBox="0 0 23 22"
              width="23"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M8.98145 8.17188H14.4121V13.6026H8.98145V8.17188Z"
                fill="#F1B44C"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M18.9381 5.45665C18.9381 4.4583 18.1262 3.64641 17.1279 3.64641H15.3176V1.83618H13.5074V3.64641H9.88693V1.83618H8.07669V3.64641H6.26646C5.26812 3.64641 4.45623 4.4583 4.45623 5.45665V7.26688H2.646V9.07711H4.45623V12.6976H2.646V14.5078H4.45623V16.318C4.45623 17.3164 5.26812 18.1283 6.26646 18.1283H8.07669V19.9385H9.88693V18.1283H13.5074V19.9385H15.3176V18.1283H17.1279C18.1262 18.1283 18.9381 17.3164 18.9381 16.318V14.5078H20.7483V12.6976H18.9381V9.07711H20.7483V7.26688H18.9381V5.45665ZM6.26579 16.3181V5.45675H17.1272L17.129 16.3181H6.26579Z"
                fill="#F1B44C"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="relative ml-7 sm:ml-[90px] -mt-1">
            <svg
              fill="none"
              height="38"
              viewBox="0 0 132 38"
              width="132"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M131.25 0H5.89889H0L36.8681 37.1876H131.25V0Z"
                fill="white"
              />
            </svg>
            <div className="text-[#556EE6] text-[19px] font-bold absolute -mt-8 right-4">
              <Trans t={t}>Default</Trans>
            </div>
          </div>
        </div>
        <div className="text-white text-[14px] md:text-[17px] font-semibold mt-4">
          •••• •••• •••• {lastNumber}
        </div>
        <div className="flex justify-between items-center mt-2 md:mt-8">
          <div className="text-white text-[15px]">{name}</div>
          <div className="text-white text-sm pr-4">{date}</div>
        </div>
      </div>
      <div className="w-1/2">
        <img alt={defaultCard.brand} src={defaultCard.icon} />
        <div className="text-xl text-[#545454] mt-2.5">
          <Trans t={t}>Card ending in</Trans> {lastNumber}
        </div>
      </div>
    </div>
  );
};

export default DefaultCard;
