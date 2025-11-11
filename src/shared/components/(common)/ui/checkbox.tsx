import { Root, Indicator } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { cn } from "@/utils/utils-old";

type CheckboxProps = ComponentPropsWithoutRef<typeof Root>;

const baseClassName =
  "peer h-5 w-5 shrink-0 rounded-sm border border-[#cfd4da] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#ebfaf5] data-[state=checked]:text-[#37c08d] data-[state=checked]:border-[#37c08d]";

const Checkbox = forwardRef<ElementRef<typeof Root>, CheckboxProps>(({ className, ...props }, ref) => (
  <Root ref={ref} className={cn(baseClassName, className)} {...props}>
    <Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </Indicator>
  </Root>
));

Checkbox.displayName = Root.displayName;

export { Checkbox };
