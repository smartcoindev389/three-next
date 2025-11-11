import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import { CHANGE_PASSWORD_MUTATION } from "@/lib/apollo/queryes/loginSecurity";
import { Input } from "@/shared/components/(common)/ui/input";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import useFormSchema from "@/shared/components/(user)/Forms/ChangePasswordForm/useFormSchema";

interface FormValues {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const defaultValues: FormValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordForm({ classes = "" }) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION);
  const formSchema = useFormSchema();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues });

  const onSubmit = async ({ password, newPassword }: FormValues) => {
    try {
      await changePassword({
        variables: { currentPassword: password, newPassword: newPassword },
      });

      reset(defaultValues);
      toast({
        type: "success",
        description: t("Password changed successfully"),
      });
    } catch (error) {
      toast({ type: "error", description: error?.message });
    }
  };

  const renderInput = (
    name: keyof FormValues,
    label: string,
    placeholder: string,
  ) => {
    return (
      <div className="w-full mb-6">
        <label className={"inline-block leading-[1.2] mb-1 text-[#434345]"}>
          {label}
        </label>
        <Input
          {...register(name)}
          className={`h-auto px-4 py-3 w-full ${errors[name] ? "border-[#F46A6A]" : "border-[#ced4dA]"} rounded-md placeholder:text-[#C2C2C2]`}
          placeholder={placeholder}
          showIcon={true}
          type="password"
        />
        {errors[name] && (
          <p className={"text-sm font-medium text-destructive"}>
            {errors[name]?.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      className={`flex flex-wrap gap-x-4 ${classes}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      {renderInput(
        "password",
        t("Current Password "),
        t("Enter Current Password"),
      )}
      {renderInput("newPassword", t("New Password"), t("Create New Password"))}
      {renderInput(
        "confirmPassword",
        t("Confirm Password"),
        t("Confirm New Password"),
      )}

      <div className="mt-5 w-full">
        <button
          className={`bg-blue leading-0 px-7 py-2 rounded-[50px] text-base text-white ${!isDirty || loading ? "opacity-50" : ""}`}
          disabled={!isDirty || loading}
          type={"submit"}
        >
          {loading ? t("Processing...") : t("Update")}
        </button>
      </div>
    </form>
  );
}
