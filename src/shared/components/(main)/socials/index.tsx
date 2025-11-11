import clsx from "clsx";
import styles from "./index.module.scss";
import { FC, useMemo } from "react";
import Image from "next/image";
import gmail from "./Gmail.svg";
import facebook from "./Facebook.svg";
import instagram from "./Instagram.svg";
import youtube from "./YouTube.svg";
import linkedin from "./Linkedin.svg";
import twitter from "./Twitter.svg";

interface SocialLink {
  id: number;
  social_network: string;
  url: string;
}

interface Props {
  zero?: boolean;
  className?: string;
  socialLinks?: SocialLink[];
}

const defaultData = [
  {
    icon: gmail,
    href: "mailto:info@platformz.us",
    type: "gmail",
  },
  {
    icon: facebook,
    href: "https://www.facebook.com/platformz.us",
    type: "facebook",
  },
  {
    icon: instagram,
    href: "https://www.instagram.com/platformzcorp",
    type: "instagram",
  },
  {
    icon: youtube,
    href: "https://www.youtube.com/@Platformz_us",
    type: "youtube",
  },
];

const iconMap: Record<string, any> = {
  gmail,
  google: gmail,
  facebook,
  instagram,
  youtube,
  twitter: twitter, // Using youtube as fallback, add twitter icon if available
  linkedin: linkedin, // Using facebook as fallback, add linkedin icon if available
};

export const Socials: FC<Props> = ({ zero, className, socialLinks }) => {
  const data = useMemo(() => {
    if (socialLinks && socialLinks.length > 0) {
      return socialLinks.map((link) => ({
        icon: iconMap[link.social_network.toLowerCase()] || gmail,
        href: link.url,
        type: link.social_network,
      }));
    }
    return defaultData;
  }, [socialLinks]);

  return (
    <ul className={clsx(styles.socials, className)}>
      {data?.length &&
        data.map((item, i) => (
          <li key={i}>
            <a href={item.href} className={clsx("icon")}>
              <Image
                className={clsx(zero && styles.zero)}
                src={item.icon}
                alt={item.type}
              ></Image>
            </a>
          </li>
        ))}
    </ul>
  );
};
