import React, { FC, useMemo } from "react";
import Image from "next/image";

import Loader from "@/shared/components/(common)/Loader/Loader";
import DefaultUserImage from "@/assets/icons/user-profile-icon.svg";
import { Customer } from "@/types/types";

type CustomAttribute = {
  code: string;
};

interface AvatarProps {
  className?: string;
  customerData: Customer;
  loading?: boolean;
  size?: number;
}

const Avatar: FC<AvatarProps> = ({
  className = "",
  customerData,
  size = 300,
  loading = false,
}) => {
  const avatarSrc = useMemo(() => {
    const avatarCustomAttribute = customerData?.custom_attributes?.find(
      (val: CustomAttribute) => val.code === "profile_pic",
    );
    const hasAvatarData =
      avatarCustomAttribute &&
      avatarCustomAttribute.value &&
      Number(avatarCustomAttribute.value) !== 0;

    if (!hasAvatarData) return DefaultUserImage;

    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/media${avatarCustomAttribute?.value}`;
  }, [customerData]);

  if (loading) return <Loader className="h-full" />;

  return (
    <Image
      alt="Userprofile"
      className={`shrink-0 max-w-full rounded-full aspect-square object-cover ${className}`}
      height={size}
      loading="lazy"
      quality={100}
      src={avatarSrc}
      width={size}
    />
  );
};

export default Avatar;
