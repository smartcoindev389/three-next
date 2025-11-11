import { format } from "date-fns";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { Referral } from "../types";

import ReferralStatus from "./ReferralStatus";

interface RowProps {
  label: string;
}

const Row: FC<PropsWithChildren<RowProps>> = ({ label, children }) => {
  const { t } = useTranslation();

  return (
    <p className="pb-1.5">
      <b className="pr-1">{t(label)}</b>
      {children}
    </p>
  );
};

interface ReferralCardsProps {
  data: Referral[];
}

const ReferralCards: FC<ReferralCardsProps> = ({ data = [] }) => {
  return (
    <div className="space-y-2">
      {data.map(
        ({
          created_at,
          customer_name,
          is_complete,
          updated_at,
          referral_host,
        }) => (
          <div
            key={created_at}
            className="shadow-md rounded border border-whitesmoke-100 p-5"
          >
            <Row label="Name">
              {customer_name === "" ? "GUEST" : customer_name}
            </Row>
            <Row label="Link Share Date">
              {format(created_at, "MM/dd/yyyy")}
            </Row>
            <Row label="Sign Up Date">{format(updated_at, "MM/dd/yyyy")}</Row>
            <Row label="Link Shared On">{referral_host ?? ""}</Row>
            <Row label="Earning Status">
              <ReferralStatus isComplete={is_complete} />
            </Row>
          </div>
        ),
      )}
    </div>
  );
};

export default ReferralCards;
