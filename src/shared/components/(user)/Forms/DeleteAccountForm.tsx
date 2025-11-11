import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import alertImage from "@/assets/icons/alert.svg";
import mailImage from "@/assets/icons/cross-mail.svg";
import {
  DELETE_CUSTOMER_ACCOUNT,
  DELETE_ACCOUNT_REASONS,
} from "@/lib/apollo/queryes/customer";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import Title from "@/shared/components/(common)/Title/Title";
import { resetToken } from "@/lib/auth/revalidateAccessToken";

const DeleteAccountForm: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [deleteReason, setDeleteReason] = useState("");
  const [additionalReason, setAdditionalReason] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [reasons, setReasons] = useState([]);
  const [deleteAccount, { loading }] = useMutation(DELETE_CUSTOMER_ACCOUNT);
  const { data } = useQuery(DELETE_ACCOUNT_REASONS);

  useEffect(() => {
    if (data?.getDeleteReasons) setReasons(data?.getDeleteReasons);
  }, [data]);

  const handleDeleteAccount = () => setIsModalOpen(true);

  const handleConfirmDeletion = async () => {
    if (isConfirmed) {
      try {
        await deleteAccount({
          variables: {
            input: {
              delete_reason:
                deleteReason === "Other" ? additionalReason : deleteReason,
            },
          },
        });

        setIsModalOpen(false);
        setIsConfirmationModalOpen(true);
        void handleLogout();
      } catch (error) {
        toast({
          type: "alert",
          description: t("Failed to delete account. Please try again later."),
        });
      }
    }
  };

  const handleLogout = async () => {
    setIsConfirmationModalOpen(false);

    return resetToken();
  };

  return (
    <>
      <div className="flex flex-wrap gap-x-[10px] gap-y-4">
        <div className="flex flex-[100%] gap-x-1 items-end mb-4">
          <Title className="text-paragraph mt-0">{t("Delete Account")}</Title>
          <div className="border-[#DCDCDC] border-solid border-t flex-auto h-px mb-[0.9em]" />
        </div>

        <div className="flex-[100%] p-6 pl-0 pt-0 bg-white">
          <div className="flex items-start gap-x-4">
            <div className="text-[#434345] text-[20px]">
              <Image
                alt="alert"
                className="mt-[5px]"
                height={50}
                src={alertImage}
                width={50}
              />
            </div>
            <div className="text-[#707070] text-[16px] leading-6">
              Once your account is closed, it is no longer accessible by you or
              anyone else, you won't be able to access your order history or
              print a proof of purchase or an invoice. This also affects related
              customer accounts, features, and services that are linked to your
              email address.
            </div>
          </div>
          <button
            className="mt-6 bg-[#FF5A5A] text-white text-[16px] py-1 px-4 rounded-[20px] hover:bg-[#e14e4e] transition-colors"
            onClick={handleDeleteAccount}
          >
            {t("Delete Account")}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-[600px] relative">
            <button
              className="absolute top-4 right-4 text-[#FF5A5A] text-[24px] hover:text-[#e14e4e] transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="font-din-condensed text-[30px] text-[#434345] font-bold mb-4 text-center">
              {t("Delete Account Permanently")}
            </h2>

            <div className="mb-4">
              <label className="text-[#707070] text-[14px] font-medium">
                {t("Tell us why you wish to close your account")}
              </label>
              <select
                className="w-full border border-[#DCDCDC] rounded-md p-2 mt-2 text-[#434345] focus:outline-none"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              >
                <option value="">Choose your reason...</option>
                {reasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
                <option value="Other">{t("Other")}</option>
              </select>
            </div>

            {deleteReason === "Other" && (
              <div className="mb-4">
                <textarea
                  className="w-full border border-[#DCDCDC] rounded-md p-2 text-[#434345] focus:outline-none"
                  placeholder="Write why you are closing account..."
                  value={additionalReason}
                  onChange={(e) => setAdditionalReason(e.target.value)}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  checked={isConfirmed}
                  className="form-checkbox h-4 w-4 text-[#FF5A5A] border-[#DCDCDC] rounded-[4px]"
                  type="checkbox"
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
                <span className="ml-2 text-[#707070] text-[14px]">
                  Yes, I want to permanently close my account and delete my data
                  *
                </span>
              </label>
            </div>

            <p className="text-[#707070] text-[14px] mb-4">
              <strong>{t("Note")}:</strong>
              {t(
                "Once your account is closed, it is no longer accessible by you or anyone else, and it cannot be restored.",
              )}
            </p>

            <div className="mb-4">
              <input
                className="w-[30%] text-[12px] border border-[#DCDCDC] rounded-md p-2 text-[#434345] focus:outline-none"
                placeholder={t(`Type "DELETE" to confirm`)}
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </div>

            <button
              className={`w-[30%] bg-[#FF5A5A] text-white text-[16px] py-2 rounded-md transition-colors ${
                isConfirmed && confirmationText === "DELETE"
                  ? "hover:bg-[#e14e4e]"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={
                !isConfirmed || confirmationText !== "DELETE" || loading
              }
              onClick={handleConfirmDeletion}
            >
              {loading ? t("Deleting...") : t("Delete Account")}
            </button>
          </div>
        </div>
      )}

      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-[500px] relative text-center">
            <button
              className="absolute top-4 right-4 text-[#FF5A5A] text-[24px] hover:text-[#e14e4e] transition-colors"
              onClick={() => handleLogout()}
            >
              &times;
            </button>

            <div className="flex flex-col items-center">
              <Image
                alt="alert"
                className="mb-4"
                height={60}
                src={mailImage}
                width={60}
              />
              <p className="text-[18px] text-[#434345] font-normal leading-[1.5]">
                A notification has been sent to your email informing you that
                your account has been deleted.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountForm;
