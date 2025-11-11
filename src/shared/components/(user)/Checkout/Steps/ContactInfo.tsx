import { useTranslation } from "react-i18next";
import { FC } from "react";

import Title from "@/shared/components/(common)/Title/Title";
import EditButton from "@/shared/components/(user)/Checkout/EditButton";
import { Customer } from "@/types/types";

interface ContactInfoProps {
  customer?: Customer;
  guestName: string;
  email: string;
  onEditGuest: () => void;
}

const ContactInfo: FC<ContactInfoProps> = ({ customer, guestName, email, onEditGuest }) => {
  const { t } = useTranslation();
  const name = customer ? `${customer?.firstname} ${customer?.lastname}` : guestName;

  return (
    <div className="w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 flex flex-row justify-between">
      <div className="w-full">
        <Title>{t("Contact Information")}</Title>
        <div className="relative">
          {guestName && <EditButton className="absolute !-right-1" isEdit={true} onClick={onEditGuest} />}
          <div className="text-[#545454] text-[20px] font-medium">{name}</div>
          <div className="text-[#545454] text-[18px] font-normal">{email}</div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
