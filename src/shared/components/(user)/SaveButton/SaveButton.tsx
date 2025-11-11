import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface SaveButtonProps {
  loading: any;
}

const SaveButton: FC<SaveButtonProps> = ({ loading }): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <button
      aria-label={t("Save")}
      className="bg-blue hover:bg-blue-700 text-white py-1.5 px-7 focus:outline-none focus:shadow-outline mr-4 text-md rounded-md"
      disabled={loading}
      type="submit"
    >
      {loading ? t("Sending") : t("Save")}
    </button>
  );
};

export default React.memo(SaveButton);
