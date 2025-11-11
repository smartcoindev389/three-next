import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import Title from "@/shared/components/(common)/Title/Title";

const TrackShipmentWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="relative py-6 md:py-12 px-5 max-md:max-w-full rounded-[5px] shadow-sm min-h-72">
      <Title className="text-paragraph text-center text-white">
        {t("Track Current")}
        <br />
        {t("Shipments")}
      </Title>
      {children}
    </div>
  );
};

export default TrackShipmentWrapper;
