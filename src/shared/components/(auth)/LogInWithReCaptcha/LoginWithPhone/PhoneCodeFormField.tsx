import { Check, ChevronDown } from "lucide-react";
import React, { FC, useState } from "react";
import countryCodes from "country-codes-list";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/(common)/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/(common)/ui/popover";
import { Button } from "@/shared/components/(common)/ui/button";
import { cn } from "@/utils/utils-old";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/(common)/ui/command";

interface PhoneCodeFormFieldProps {
  form: any;
}

const PhoneCodeFormField: FC<PhoneCodeFormFieldProps> = ({ form }) => {
  const [phoneCodes] = useState(
    countryCodes?.customList(
      "countryCode",
      "+{countryCallingCode}({countryNameEn})",
    ) || {},
  );
  const [phoneCodesOpened, setPhoneCodesOpened] = useState(false);

  return (
    <FormField
      control={form.control}
      name="phoneCode"
      render={() => (
        <FormItem {...({} as any)}>
          <Popover
            open={phoneCodesOpened}
            onOpenChange={(isOpen) => {
              if (isOpen !== phoneCodesOpened) setPhoneCodesOpened(isOpen);
            }}
          >
            <PopoverTrigger asChild>
              <FormControl {...({} as any)}>
                <Button {...({} as any)}
                  className={cn(
                    "w-full text-white justify-between border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] font-normal text-base",
                    !form.getValues().phoneCode && "text-muted-foreground",
                  )}
                  role="combobox"
                  variant="outline"
                >
                  {form.getValues().phoneCode
                    ? Object.entries(phoneCodes).find(
                        (code) => code[1] === form.getValues().phoneCode,
                      )
                    : "Select Phone Code"}
                  <ChevronDown className="opacity-50 text-white" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent {...({} as any)} className="max-sm:!w-[calc(100vw-80px)] sm:w-[415px] !mx-10 p-0 bg-[#081927] text-white">
              <Command {...({} as any)}>
                <CommandInput
                  className="h-12 w-full text-base border-none focus:ring-0 text-white placeholder:text-white"
                  placeholder="Search Phone Codes..."
                  {...({} as any)}
                />
                <CommandList {...({} as any)}>
                  <CommandEmpty {...({} as any)}>No Phone Code found.</CommandEmpty>
                  <CommandGroup {...({} as any)}>
                    {Object.entries(phoneCodes).map((code) => (
                      <CommandItem {...({} as any)}
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
                            code[1] === form.getValues().phoneCode
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
  );
};

export default PhoneCodeFormField;
