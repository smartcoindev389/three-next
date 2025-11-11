import { X } from "lucide-react";
import { useState, FC, ChangeEvent } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_REFERRAL_CODE } from "@/lib/apollo/queryes/referral";
import { useToast } from "@/shared/components/(common)/ui/use-toast";

interface ReferralPopupProps {
  onClose: () => void;
  referralLink: string;
  siteUrl: string;
  onRefetch: () => Promise<unknown>;
  className?: string;
}

const ReferralPopup: FC<ReferralPopupProps> = ({
  onClose,
  referralLink,
  siteUrl,
  onRefetch,
}) => {
  const [customSlug, setCustomSlug] = useState<string>("");
  const [updateReferralCode, { loading }] = useMutation(UPDATE_REFERRAL_CODE);
  const { toast } = useToast();
  const baseUrl = siteUrl + "refer/";

  const handleSave = async (): Promise<void> => {
    if (!customSlug.trim()) return;

    try {
      interface UpdateReferralCodeResponse {
        data?: {
          updateReferralCode?: {
            success: boolean;
          };
        };
      }

      const response: UpdateReferralCodeResponse = await updateReferralCode({
        variables: {
          code: customSlug.trim(),
          type: 1,
        },
      });

      if (response?.data) {
        toast({
          type: "success",
          description: "Your referral link has been updated.",
        });

        await onRefetch();
        onClose();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({ type: "error", description: errorMessage });
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative text-left">
        <button
          className="absolute top-4 right-4 text-white bg-red-400 hover:bg-red-500 w-8 h-8 rounded-full flex items-center justify-center"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Customize Referral Link
        </h2>
        <hr className="mb-6" />
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Your current referral link
          </span>
          <p className="text-gray-500 text-sm">{referralLink}</p>
        </div>
        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Your custom referral link
          </span>
          <div className="flex items-center rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <span className="px-3 text-gray-400 text-sm select-none">
              {baseUrl}
            </span>
            <input
              className="flex-1 px-3 py-2 text-sm outline-none border-l border-gray-200"
              placeholder="Type here..."
              type="text"
              value={customSlug}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCustomSlug(e.target.value)
              }
            />
          </div>
        </div>
        <button
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-6 py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
          onClick={handleSave}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ReferralPopup;
