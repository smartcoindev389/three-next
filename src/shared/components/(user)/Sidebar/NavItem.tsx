import React, { FC, PropsWithChildren, ReactElement, useRef } from "react";
import Link from "next/link";

interface NavItemProps extends PropsWithChildren {
  menu: string;
  link: string;
  submenu?: boolean;
  message?: string;
  icon: ReactElement<any, any>;
  active?: boolean;
  open?: boolean;
  collapsed: boolean;
  setOpen?: (open: boolean) => void;
}

const NavItem: FC<NavItemProps> = ({
  menu,
  link,
  submenu,
  message,
  icon,
  children,
  active,
  open,
  setOpen,
  collapsed,
}) => {
  const trigger = useRef(null);
  const dropdown = useRef(null);

  return (
    <li className="relative">
      <Link
        ref={trigger}
        className={`${collapsed ? " md:text-[0px] md:justify-center" : ""} relative flex w-full items-center rounded py-[10px] px-6 text-base font-medium text-white `}
        href={link}
        onClick={() => (setOpen ? setOpen(!open) : "")}
      >
        <span className={`${!collapsed ? "mr-3" : "max-md:mr-3"} ${active? "!text-[#3F65FD]" : ""}`}>{icon}</span>
        {menu}
        {message && (
          <span className="ml-3 mt-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF3D3D] text-[10px] font-semibold leading-none text-white">
            {message}
          </span>
        )}
        {submenu && (
          <span
            className={`${open === true ? "rotate-0" : "rotate-180"}${collapsed ? " md:hidden" : ""} absolute top-1/2 right-6 -translate-y-1/2`}
          >
            <svg
              className="fill-current"
              height="20"
              viewBox="0 0 20 20"
              width="20"
            >
              <path
                clipRule="evenodd"
                d="M15.5899 13.0899C15.2645 13.4153 14.7368 13.4153 14.4114 13.0899L10.0006 8.67916L5.58991 13.0899C5.26447 13.4153 4.73683 13.4153 4.41139 13.0899C4.08596 12.7645 4.08596 12.2368 4.41139 11.9114L9.41139 6.9114C9.73683 6.58596 10.2645 6.58596 10.5899 6.9114L15.5899 11.9114C15.9153 12.2368 15.9153 12.7645 15.5899 13.0899Z"
                fillRule="evenodd"
              />
            </svg>
          </span>
        )}
      </Link>
      <div
        ref={dropdown}
        className={`${open === true && submenu ? "block" : "hidden"}${collapsed ? " md:hidden" : ""}`}
      >
        <ul className="py-1 px-6">{children}</ul>
      </div>
    </li>
  );
};

export default NavItem;
