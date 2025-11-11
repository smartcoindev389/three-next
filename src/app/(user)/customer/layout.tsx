"use client";

import { FC, PropsWithChildren } from "react";

// import useAuthGuard from "@/hooks/useAuthGuard";
// import Loader from "@/shared/components/(common)/Loader/Loader";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  // const isAllowed = useAuthGuard();

  // if (!isAllowed) return <Loader className="fixed inset-0" />;

  return children;
};

export default Layout;
