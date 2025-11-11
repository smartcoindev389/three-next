"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import countryCodes from "country-codes-list";

import {
  CREATE_USER,
  CHECK_CUSTOMER_PHONE,
} from "@/lib/apollo/queryes/customer";
import Sso from "@/shared/components/(auth)/SSO/SSO";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/(common)/ui/form";
import { Input } from "@/shared/components/(common)/ui/input";
import { Button } from "@/shared/components/(common)/ui/button";
import { Checkbox } from "@/shared/components/(common)/ui/checkbox";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { COUNTRIES } from "@/lib/apollo/queryes/others";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/(common)/ui/popover";
import { cn } from "@/utils/utils-old";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/(common)/ui/command";
import { strapi } from "@/lib/strapi/strapi";
import * as fbq from "@/utils/facebook-pixel";
import useRecaptcha from "@/hooks/useReсaptcha";
import useTwilio from "@/hooks/useTwilio";

function RegisterWithReCaptcha() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const { toast } = useToast();
  const [showInputField] = useState(true);
  const [phoneCodes] = useState(
    countryCodes?.customList
      ? countryCodes.customList(
          "countryCode",
          "+{countryCallingCode}({countryNameEn})",
        )
      : {},
  );
  const [phoneCodesOpened, setPhoneCodesOpened] = useState(false);
  const { verifyRecaptcha, setRecaptchaToken, recaptchaRef, resetRecaptcha } = useRecaptcha();
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [openPolicy, setOpenPolicy] = useState({
    policy: false,
    terms: false,
    email: false,
    sms: false,
  });
  const [registerPolicy, setRegisterPolicy] = useState(null);
  const { sendEmail } = useTwilio();

  useEffect(() => {
    strapi.getRegisterPolicy().then((res) => {
      setRegisterPolicy(res.data);
    });
  }, []);

  const toggleVisibility = (field) => {
    setVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const togglePolicy = (field) => {
    setOpenPolicy((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const phoneUtil = PhoneNumberUtil.getInstance();
  const [checkCustomerPhone] = useLazyQuery(CHECK_CUSTOMER_PHONE);

  const { data: countryReq, loading: countryReqLoading } = useQuery(COUNTRIES);

  useEffect(() => {
    if (!countryReqLoading && countryReq?.countries) {
      const country = [...countryReq.countries];
      const unitedStatesEntry = country.find((item) => item.full_name_english === "United States");
      const filteredCountry = country.filter(
        (item) => item.full_name_english !== "---select---" && item.full_name_english !== "United States"
      );
      const sortedEntries = filteredCountry.toSorted((a, b) => {
        if (a.full_name_english < b.full_name_english) {
          return -1;
        }
        if (a.full_name_english > b.full_name_english) {
          return 1;
        }

        return 0;
      });

      const sortedCountry = [unitedStatesEntry, ...sortedEntries];

      setCountries(sortedCountry);
    }
  }, [countryReqLoading, countryReq?.countries]);

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(
        phoneUtil.parseAndKeepRawInput(
          form.getValues("phoneCode").substring(0, form.getValues("phoneCode").indexOf("(")) + phone
        )
      );
    } catch (error) {
      return false;
    }
  };

  const [createUser, { loading }] = useMutation(CREATE_USER);

  const passwordSchema = z
    .string()
    .min(8, { message: t("Password must be at least 8 characters long") })
    .regex(/[a-z]/, {
      message: t("Password must contain at least one lowercase letter"),
    })
    .regex(/[A-Z]/, {
      message: t("Password must contain at least one uppercase letter"),
    })
    .regex(/\d/, { message: t("Password must contain at least one number") })
    .regex(/[^a-zA-Z0-9]/, {
      message: t("Password must contain at least one special character"),
    });

  const formSchema = z
    .object({
      firstName: z.string().min(1, { message: t("This field is required") }),
      lastName: z.string().min(1, { message: t("This field is required") }),
      email: z
        .string()
        .min(1, { message: t("Email address is required") })
        .email("Invalid email format"),
      password: passwordSchema,
      confirm_password: z.string().min(1, { message: t("This field is required") }),
      terms_of_use: z.boolean().refine((value) => value === true, {
        message: t("This field is required"),
      }),
      acceptPrivacy: z.boolean().refine((value) => value === true, {
        message: t("This field is required"),
      }),
      subscribe: z.boolean().default(false).optional(),
      acceptEmail: z.boolean().default(false).optional(),
      acceptSms: z.boolean().default(false).optional(),
      phone_number: showInputField
        ? z
          .string()
          .min(1, { message: "Phone Number is required" })
          .refine((value) => isPhoneValid(value), {
            message: t("Invalid phone number"),
          })
        : z.string().optional(),
      phoneCode: z.string().optional().default("+1(United States of America)"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("Passwords don't match"),
      path: ["confirm_password"], // path of error
    });

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptPrivacy: false,
      subscribe: false,
      terms_of_use: false,
      acceptEmail: false,
      acceptSms: false,
      phoneCode: "+1(United States of America)",
      phone_number: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Track registration form start
    fbq.event("StartRegistration", {
      method: "email",
      content_name: "Registration Form",
    });

    try {
      if (await verifyRecaptcha()) {
        const phone =
          form.getValues("phoneCode").substring(0, form.getValues("phoneCode").indexOf("(")) +
          form.getValues("phone_number");
        const isPhoneValid = await checkCustomerPhone({
          variables: { phone },
          fetchPolicy: "no-cache",
        });

        if (!isPhoneValid.data.checkCustomerPhone.success) {
          await register(data, phone);
        } else {
          resetRecaptcha();
          toast({
            type: "error",
            title: t("Error"),
            description: t("User Already Exist with same PhoneNumber"),
          });
          setIsLoading(false);
        }
      } else {
        resetRecaptcha();
        toast({
          type: "error",
          title: t("Error"),
          description: t("An error occurred during reCAPTCHA verification. Please try again."),
        });
        setIsLoading(false);
      }
    } catch (error) {
      resetRecaptcha();
      toast({
        type: "error",
        title: t("Error"),
        description: t("An error occurred during reCAPTCHA verification. Please try again."),
      });
      setIsLoading(false);
    }
  };

  const register = async (data, phone) => {
    setIsLoading(true);

    try {
      await createUser({
        variables: {
          email: data.email,
          firstname: data.firstName,
          lastname: data.lastName,
          password: data.password,
          phone_number: phone,
          is_subscribed: data.acceptEmail,
          sms_alert: data.acceptSms,
        },
      });

      localStorage.setItem("prelogin", JSON.stringify({ email: data.email, phone }));

      await sendEmail(data.email);

      toast({ description: "Email sent successfully!" });

      fbq.completeRegistration({
        content_name: "Registration Complete",
        status: true,
        method: "email",
      });

      router.push("/login-with-email-otp");
    } catch (error) {
      toast({
        type: "error",
        title: t("Uh oh! Something went wrong."),
        description: error.message,
      });
    }

    setIsLoading(false);
  };

  const policy = useCallback(
    (data, value) => {
      return (
        <PopoverContent
          className="bg-[#F8F8F8] rounded-[10px] border border-[#ABABAB] p-[30px] gap-5 flex flex-col w-full max-w-[382px] md:max-w-[715px]"
          side="top"
        >
          <div className="flex items-center justify-between">
            <div className="text-primary text-xl font-medium">
              {data?.title}
            </div>
            <button onClick={() => togglePolicy(value)}>
              <svg
                fill="none"
                height="20"
                viewBox="0 0 19 20"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.5L1 18.5"
                  stroke="#74788D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M1 1.5L18 18.5"
                  stroke="#74788D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: data?.content }}
            className="text-sm text-[#74788D] max-h-[500px] overflow-auto prose"
          />
        </PopoverContent>
      );
    },
    [togglePolicy, form],
  );

  return (
    <div className={"w-full mt-12 md:mt-24 pb-12 md:pb-24 px-5 md:px-0 max-w-6xl mx-auto"}>
      <div className="max-w-[415px] mx-auto">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-center font-din-condensed leading-none mb-1 text-[40px] font-bold text-white">
            {t("Create Your Account")}
          </h1>
        </div>

        <div className={"w-[80%] mx-auto relative mt-5 md:mt-[22px] flex items-center justify-center "}>
          <div className="w-[30%] my-auto h-px bg-[#97E3FF33]" />
          <p className="w-full text-center text-lg text-white font-semibold block px-4 mx-auto relative z-10">
            Social Sign Up
          </p>
          <div className="w-[30%] my-auto h-px bg-[#97E3FF33]" />
        </div>
        <Suspense>
          <Sso login={false} />
        </Suspense>
        <div className={"w-full mx-auto relative mb-5 md:mb-[30px] flex items-center justify-center"}>
          <div className="my-auto h-px w-full bg-[#97E3FF33]" />
          <p className="w-fit text-center text-lg text-white font-semibold block px-4 mx-auto relative z-10">
            or
          </p>
          <div className="my-auto h-px w-full bg-[#97E3FF33]" />
        </div>
      </div>

      <div className="max-w-[945px] mx-auto">
        <Form {...form}>
          <form
            className="space-y-5 md:space-y-7"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
                        className={`w-full px-3.5 border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        placeholder={t("Last Name")}
                        {...field}
                        className={`w-full px-3.5 border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full justify-between border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display text-white placeholder:text-white rounded-[5px] font-normal text-base",
                              !field.value && "text-muted-foreground text-white",
                            )}
                            role="combobox"
                            variant="outline"
                          >
                            {field.value
                              ? countries.find(
                                (country) =>
                                  country &&
                                  country.full_name_english === field.value,
                              )?.full_name_english
                              : "Select Country"}
                            <ChevronDown className="opacity-50 text-white" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="max-sm:!w-[calc(100vw-80px)] sm:w-[415px] !mx-10 p-0 bg-[#081927] text-white">
                        <Command>
                          <CommandInput
                            className="h-12 w-full text-base border-none focus:ring-0 text-white placeholder:text-white"
                            placeholder="Search Country..."
                          />
                          <CommandList>
                            <CommandEmpty>No Country found.</CommandEmpty>
                            <CommandGroup>
                              {countries.map(
                                (country) =>
                                  country && (
                                    <CommandItem
                                      key={country.id}
                                      className="text-base"
                                      value={country.full_name_english}
                                      onSelect={() => {
                                        form.setValue(
                                          "country",
                                          country.full_name_english,
                                        );
                                      }}
                                    >
                                      {country.full_name_english}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          country.full_name_english ===
                                            field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ),
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 mx-auto h-px bg-[#DDD]/28 my-[30px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        placeholder={t("Email")}
                        {...field}
                        className={`w-full px-3.5 border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0 relative">
                    <FormControl>
                      <Input
                        placeholder={t("Password")}
                        type={visibility.password ? "text" : "password"}
                        {...field}
                        className={`w-full px-3.5 border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <button
                      className="absolute right-4 top-5"
                      type="button"
                      onClick={() => toggleVisibility("password")}
                    >
                      {visibility.password ? (
                        <svg
                          fill="none"
                          height="16"
                          viewBox="0 0 20 16"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.13684 10.0353C5.56507 7.90144 6.8314 5.70809 8.96527 5.13632C9.60358 4.96529 10.2472 4.95873 10.8512 5.09067M13.3311 6.78285C13.5661 7.13584 13.7484 7.5325 13.8642 7.96475C14.436 10.0986 13.1697 12.292 11.0358 12.8637C9.57913 13.254 8.09472 12.7878 7.11738 11.7737"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M1 9C1 9 2.94595 2 10 2C11.3451 2 12.5044 2.25452 13.5 2.6665M19 9C19 9 18.4793 7.12675 17 5.31834"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M18 1.5L3.5 15"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          height="13"
                          viewBox="0 0 20 13"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="8.34998"
                            r="3.4"
                            stroke="white"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M1 8.34998C1 8.34998 2.94595 1.34998 10 1.34998C17.0541 1.34998 19 8.34998 19 8.34998"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                        </svg>
                      )}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="space-y-0 relative">
                    <FormControl>
                      <Input
                        placeholder={t("Confirm Password")}
                        type={visibility.confirmPassword ? "text" : "password"}
                        {...field}
                        className={`w-full px-3.5 border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <button
                      className="absolute right-4 top-5"
                      type="button"
                      onClick={() => toggleVisibility("confirmPassword")}
                    >
                      {visibility.confirmPassword ? (
                        <svg
                          fill="none"
                          height="16"
                          viewBox="0 0 20 16"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.13684 10.0353C5.56507 7.90144 6.8314 5.70809 8.96527 5.13632C9.60358 4.96529 10.2472 4.95873 10.8512 5.09067M13.3311 6.78285C13.5661 7.13584 13.7484 7.5325 13.8642 7.96475C14.436 10.0986 13.1697 12.292 11.0358 12.8637C9.57913 13.254 8.09472 12.7878 7.11738 11.7737"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M1 9C1 9 2.94595 2 10 2C11.3451 2 12.5044 2.25452 13.5 2.6665M19 9C19 9 18.4793 7.12675 17 5.31834"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M18 1.5L3.5 15"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          height="13"
                          viewBox="0 0 20 13"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="8.34998"
                            r="3.4"
                            stroke="white"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M1 8.34998C1 8.34998 2.94595 1.34998 10 1.34998C17.0541 1.34998 19 8.34998 19 8.34998"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="1.2"
                          />
                        </svg>
                      )}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneCode"
                render={({ field }) => (
                  <FormItem>
                    <Popover
                      open={phoneCodesOpened}
                      onOpenChange={(isOpen) => {
                        if (isOpen !== phoneCodesOpened) {
                          setPhoneCodesOpened(isOpen);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full justify-between border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display text-white placeholder:text-white rounded-[5px] font-normal text-base",
                              !field.value && "text-muted-foreground text-white",
                            )}
                            role="combobox"
                            variant="outline"
                          >
                            {field.value
                              ? Object.entries(phoneCodes).find(
                                (code) => code[1] === field.value,
                              )
                              : "Select Phone Code"}
                            <ChevronDown className="opacity-50 text-white" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="max-sm:!w-[calc(100vw-80px)] sm:w-[415px] !mx-10 p-0 bg-[#081927] text-white">
                        <Command>
                          <CommandInput
                            className="h-12 w-full text-base border-none focus:ring-0 text-white placeholder:text-white"
                            placeholder="Search Phone Codes..."
                          />
                          <CommandList>
                            <CommandEmpty>No Phone Code found.</CommandEmpty>
                            <CommandGroup>
                              {Object.entries(phoneCodes).map((code) => (
                                <CommandItem
                                  key={code[1]}
                                  className="text-base"
                                  value={code[1]}
                                  onSelect={() => {
                                    form.setValue("phoneCode", code[1]);
                                    setPhoneCodesOpened(false);
                                  }}
                                >
                                  {code[1]}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      code[1] === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        placeholder={t("Phone Number")}
                        {...field}
                        className={`w-full px-3.5 border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 justify-between mx-4">
                <span className="text-base text-white font-medium">Accept Legal Terms</span>
                <div className="flex items-center justify-start gap-11 w-full">
                  {registerPolicy?.privacy?.visible && (
                    <FormField
                      control={form.control}
                      name="acceptPrivacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              id="privacy_policy"
                              onCheckedChange={field.onChange}
                              className="m-0 mr-3"
                            />
                          </FormControl>
                          <div className="leading-none">
                            <Popover
                              open={openPolicy.policy}
                              onOpenChange={() => togglePolicy("policy")}
                            >
                              <PopoverTrigger>
                                <FormLabel className="text-[15px] text-white underline cursor-pointer pt-1">
                                  {t("Privacy Policy")}
                                </FormLabel>
                              </PopoverTrigger>
                              {policy(registerPolicy?.privacy, "policy")}
                            </Popover>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                  {registerPolicy?.terms?.visible && (
                    <FormField
                      control={form.control}
                      name="terms_of_use"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              id="terms_of_use"
                              onCheckedChange={field.onChange}
                              className="m-0 mr-3"
                            />
                          </FormControl>
                          <div className="leading-none">
                            <Popover
                              open={openPolicy.terms}
                              onOpenChange={() => togglePolicy("terms")}
                            >
                              <PopoverTrigger>
                                <FormLabel className="text-[15px] text-white underline cursor-pointer">
                                  {t("Terms of Use")}
                                </FormLabel>
                              </PopoverTrigger>
                              {policy(registerPolicy?.terms, "terms")}
                            </Popover>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex gap-4 flex-col-reverse md:flex-row">
                <p className="text-base text-[#74788D] font-medium my-2 md:my-4 w-full md:w-1/2">
                  Make sure you enter a phone number you can always access. It will be used to verify your identity any time you sign in on a new device or web browser. Messaging or data rates may apply.
                </p>
                <div className="flex flex-col gap-2 px-4 md:w-1/2 w-full">
                  <span className="text-base text-white font-medium">Opt Info</span>
                  <div className="flex items-center justify-start gap-11 w-full">
                    {registerPolicy?.email?.visible && (
                      <FormField
                        control={form.control}
                        name="acceptEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0.5 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                id="acceptEmail"
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="leading-none">
                              <Popover
                                open={openPolicy.email}
                                onOpenChange={() => togglePolicy("email")}
                              >
                                <PopoverTrigger>
                                  <FormLabel className="text-[15px] text-white underline cursor-pointer">
                                    {t("Email")}
                                  </FormLabel>
                                </PopoverTrigger>
                                {policy(registerPolicy?.email, "email")}
                              </Popover>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                    {registerPolicy?.sms?.visible && (
                      <FormField
                        control={form.control}
                        name="acceptSms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0.5 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                id="acceptSms"
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="leading-none">
                              <Popover
                                open={openPolicy.sms}
                                onOpenChange={() => togglePolicy("sms")}
                              >
                                <PopoverTrigger>
                                  <FormLabel className="text-[15px] text-white underline cursor-pointer">
                                    {t("SMS")}
                                  </FormLabel>
                                </PopoverTrigger>
                                {policy(registerPolicy?.sms, "sms")}
                              </Popover>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 mx-auto h-px bg-[#DDD]/28 my-[30px]" />
            <div className="w-full flex justify-center items-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA}
                onChange={setRecaptchaToken}
              />
            </div>

            <div className="w-full flex justify-center items-center">
              <Button
                className="bg-[#3F65FD] w-auto h-auto px-8 text-xl font-medium py-3.5 hover:bg-blue rounded-[5px] text-white"
                type="submit"
              >
                {loading || isLoading ? t("Sending...") : t("Register and Get Link")}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-white text-base text-center mt-6">
          {t("Already have an Account?")}{" "}
          <Link className="text-white font-bold underline" href="/login">
            {t("Sign In")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterWithReCaptcha;
