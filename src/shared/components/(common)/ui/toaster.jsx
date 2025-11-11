import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/shared/components/(common)/ui/toast";
import { useToast } from "@/shared/components/(common)/ui/use-toast";

export function Toaster({ viewportClasses = "" }) {
  const { toasts } = useToast();

  return (
    <div className="relative z-[2000]">
      {toasts.map(({ id, title, description, action, icon, ...props }) => (
        <Toast key={id} {...props}>
          {icon}
          <div className="grid gap-1 text-start pr-6">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport className={viewportClasses} />
    </div>
  );
}
