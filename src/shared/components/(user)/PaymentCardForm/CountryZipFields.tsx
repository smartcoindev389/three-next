import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";

interface CountryZipFieldsProps {
  storeList: [any];
}

const CountryZipFields: FC<CountryZipFieldsProps> = ({
  storeList,
}): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <div className="w-1/2">
        <p className="py-1 text-[15px] font-[400] text-[#545454] m-0">
          <Trans t={t}>Country</Trans>
        </p>
        <select
          required
          className="w-full px-1 py-2 rounded-[5px] text-[16px] text-[#90959B] border shadow-boxShadowWM border-[#E6E6E6]"
          name="country"
        >
          <option value="">
            <Trans t={t}>Select Country</Trans>
          </option>
          {Array.isArray(storeList) &&
            storeList.map((store) => (
              <option key={store.code} value={store.code}>
                {store.name}
              </option>
            ))}
        </select>
      </div>
      <div className="w-1/2 ml-2">
        <p className="py-1 text-[15px] font-[400] text-[#545454] m-0">
          <Trans t={t}>Zip</Trans>
        </p>
        <input
          required
          className="w-full px-1 py-2 rounded-[5px] text-[16px] text-[#90959B] border shadow-boxShadowWM border-[#E6E6E6]"
          name="zip"
          placeholder="10024"
          type="text"
        />
      </div>
    </div>
  );
};

export default CountryZipFields;
