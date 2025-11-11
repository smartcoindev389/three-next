import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/utils/utils-old";

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed flex flex-col-reverse max-h-screen md:max-w-[550px] p-4 sm:flex-col w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      className,
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "toast group pointer-events-auto relative flex w-full gap-5 overflow-hidden rounded-md border p-6 rounded-[25px] shadow-lg transition-all data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
  {
    variants: {
      variant: {
        default: "border-[#EBEBEB] bg-white text-foreground",
        solid_error:
          "toast--solid-error bg-[#F25454] border-[#F25454] items-center p-5 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute hover:text-foreground m-0 right-5 text-[#949390] top-5",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-6 w-6" />
  </ToastPrimitives.Close>
));

ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "font-semibold leading-[1.2] text-[#434345] text-[22px]",
      className,
    )}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-[#949390] text-lg whitespace-normal flex justify-center items-center", className)}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
