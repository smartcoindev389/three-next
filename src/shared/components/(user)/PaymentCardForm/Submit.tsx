import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface SubmitProps {
  loading: boolean;
}

const Submit: FC<SubmitProps> = ({ loading }): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <button
        className="px-4 py-2 font-sf-pro-display text-md font-[400] text-[#fff] rounded-[5px] bg-deepskyblue-100"
        disabled={loading}
        type="submit"
      >
        {loading ? t("Saving...") : t("Save Card")}
      </button>
    </div>
  );
};

export default Submit;
