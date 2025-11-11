import { FC } from "react";
import { useTranslation } from "react-i18next";

import { EditSvgIcon } from "@/shared/components/(common)/Icons/svgIcons";

interface EditButtonProps {
  isEdit: boolean;
  onClick: () => void;
  className?: string;
}

const EditButton: FC<EditButtonProps> = ({
  onClick,
  isEdit,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <button
      className={`absolute top-4 right-4 flex items-baseline ${className}`}
      onClick={onClick}
    >
      <EditSvgIcon />
      <div className="text-blue text-sm ml-1">
        {isEdit ? t("Edit") : t("Add")}
      </div>
    </button>
  );
};

export default EditButton;
