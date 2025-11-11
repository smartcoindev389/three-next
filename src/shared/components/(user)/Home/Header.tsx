"use client";

import { FC } from "react";

import OptionalSecurityPopup from "@/shared/components/(user)/OptionalSecurityPopup/OptionalSecurityPopup";

import ProfileData from "@/shared/components/(user)/ProfileData/ProfileData";

interface HeaderProps {
  name?: string;
  email?: string;
  userImg?: string;
}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex gap-4 items-center max-md:flex-wrap">
      <ProfileData />
      <OptionalSecurityPopup />
    </div>
  );
};

export default Header;
