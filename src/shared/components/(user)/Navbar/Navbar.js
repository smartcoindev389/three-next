"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import Logo from "@/assets/icons/logo.png";
import CurrencySwitcher from "@/shared/components/(common)/CurrencySwitcher/CurrencySwitcher";
import StoreSwitcher from "@/shared/components/(common)/StoreSwitcher/StoreSwitcher";
import AccountMenu from "@/shared/components/(user)/Navbar/AccountMenu/AccountMenu";

const Navbar = ({ menuOpened, menuCollapsed, full }) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const HomeLink = full ? "/" : "/customer/home";
  const HomeLabel = full ? t("Go to Home") : t("Back to Home");

  const router = useRouter();
  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };

    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <header
      suppressHydrationWarning
      className={`bg-gray-300 fixed top-0 w-full transition-all ${full ? "w-full" : menuOpened ? (menuCollapsed ? "md:w-[calc(100vw-130px)]" : "md:w-[calc(100vw-300px)]") : "md:w-[calc(100vw-20px)]"} z-50`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between bg-[#001322] max-sm:h-auto h-[70px] max-sm:py-2 px-4 xl:px-[30px]">
          {full && (
            <Link className="block shrink-0" href="/">
              <span className="text-white text-2xl font-bold">Platformz</span>
            </Link>
          )}
          <div className="flex w-full items-center justify-end">
            <div className="flex w-full items-center justify-end gap-4 max-sm:flex-wrap max-sm:gap-y-2">
              <motion.div
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 1.5, duration: 0.5, ease: "easeInOut" },
                }}
                className={"max-sm:-order-1"}
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: -12 }}
              >
                <Link
                  className="flex items-center gap-2 px-3 py-2 rounded-md md:text-white text-[#495057] md:bg-[#00C0F3]"
                  href={HomeLink}
                >
                  <svg
                    className="max-md:w-auto max-md:h-8"
                    fill="none"
                    height="16"
                    viewBox="0 0 15 16"
                    width="15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M6.74338 1.07454C6.51762 1.15508 6.22338 1.30177 6.08954 1.40054C5.95569 1.49923 4.85315 2.49077 3.63954 3.60392C1.732 5.35346 1.40362 5.68746 1.21646 6.06854L1 6.50939V9.894V13.2786L1.26262 13.7629C1.54808 14.2894 1.89669 14.6096 2.47462 14.8764C2.84592 15.0478 2.84923 15.0478 7.5 15.0478H12.1538L12.5835 14.8463C13.1069 14.6009 13.5072 14.2134 13.7885 13.6799L14 13.2786V9.88854V6.49854L13.7678 6.04454C13.5672 5.65231 13.2194 5.30108 11.2127 3.46439C8.69162 1.15692 8.48877 1.01562 7.61539 0.958309C7.29231 0.937155 7.03077 0.972002 6.74338 1.07454ZM6.92308 2.04062C6.79615 2.09677 5.68577 3.06316 4.45546 4.18808C2.87823 5.63039 2.18 6.31954 2.08738 6.52531C1.96915 6.78785 1.95823 7.13323 1.978 9.97662L2 13.1362L2.20646 13.4481C2.33077 13.6358 2.54708 13.8249 2.75 13.9232C3.08146 14.0836 3.16023 14.0863 7.5 14.0863C11.8398 14.0863 11.9185 14.0836 12.25 13.9232C12.4529 13.8249 12.6692 13.6358 12.7935 13.4481L13 13.1362L13.022 9.97662C13.0418 7.12923 13.0309 6.78816 12.9122 6.52431C12.7563 6.17785 8.45977 2.20354 8.06015 2.03616C7.74838 1.90554 7.22369 1.90762 6.92308 2.04062ZM5.72015 11.2415C5.52731 11.3541 5.47346 11.6882 5.61362 11.9022L5.73431 12.0863H7.5H9.26569L9.38638 11.9022C9.53092 11.6815 9.47015 11.3477 9.26546 11.2382C9.08423 11.1412 5.88677 11.1442 5.72015 11.2415Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      stroke="white"
                      strokeWidth="0.4"
                    />
                  </svg>
                  <span className="max-md:hidden">{HomeLabel}</span>
                </Link>
              </motion.div>
              <Suspense fallback={null}>
                <CurrencySwitcher className="max-lg:hidden" />
                <StoreSwitcher className="max-lg:hidden" />
              </Suspense>
              <button
                aria-label={"Cart"}
                className="pr-2"
                onClick={() => router.push("/shopping-cart")}
              >
                <svg
                  fill="none"
                  height="30"
                  viewBox="0 0 30 30"
                  width="30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.5199 23.3999H8.53198L4.62599 1.924C4.58029 1.66681 4.44613 1.43369 4.24672 1.26496C4.04731 1.09622 3.7952 1.0025 3.53399 1H1"
                    stroke="#495057"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.96015 29.0001C11.5065 29.0001 12.7601 27.7465 12.7601 26.2001C12.7601 24.6537 11.5065 23.4001 9.96015 23.4001C8.41376 23.4001 7.16016 24.6537 7.16016 26.2001C7.16016 27.7465 8.41376 29.0001 9.96015 29.0001Z"
                    stroke="#495057"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24.5187 29.0001C26.0651 29.0001 27.3187 27.7465 27.3187 26.2001C27.3187 24.6537 26.0651 23.4001 24.5187 23.4001C22.9723 23.4001 21.7188 24.6537 21.7188 26.2001C21.7188 27.7465 22.9723 29.0001 24.5187 29.0001Z"
                    stroke="#495057"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.51046 17.7998H25.0944C25.618 17.8014 26.1253 17.6184 26.5273 17.283C26.9293 16.9476 27.2002 16.4812 27.2924 15.9658L29.0004 6.59985H5.48047"
                    stroke="#495057"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <AccountMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
