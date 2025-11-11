"use client";

import { useState, useRef, FC, PropsWithChildren, useEffect } from "react";

import Sidebar from "@/shared/components/(user)/Sidebar/Sidebar";
import Navbar from "@/shared/components/(user)/Navbar/Navbar";
import Footer from "@/shared/components/(common)/Footer/Footer";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/shared/components/(common)/ui/sheet";
import useMobile from "@/hooks/useMobile";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const mainRef = useRef();
  const isMobileView = useMobile();
  const [showMenu, setShowMenu] = useState(true);
  const [collapsedMenu, setCollapsedMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleCollapsedMenu = () => setCollapsedMenu(!collapsedMenu);

  useEffect(() => {
    setShowMenu(!isMobileView);
  }, [isMobileView]);

  return (
    <>
      <div className="min-h-screen flex">
        <Sheet
          defaultOpen
          modal={isMobileView}
          open={showMenu}
          onOpenChange={(open) => {
            if (isMobileView) setShowMenu(open);
          }}
        >
          <SheetContent
            className={`${collapsedMenu ? "md:w-[110px]" : ""} w-[280px] p-0`}
            side="left"
          >
            <SheetTitle />
            <Sidebar
              collapsed={collapsedMenu}
              toggleCollapsed={toggleCollapsedMenu}
            />
          </SheetContent>
        </Sheet>

        <div
          ref={mainRef}
          className={`transition-all ${showMenu ? `w-full ${collapsedMenu ? "md:w-[calc(100vw-110px)] md:ml-[110px]" : "md:w-[calc(100vw-280px)] md:ml-[280px]"}` : "w-full"}`}
        >
          <Navbar
            menuCollapsed={collapsedMenu}
            menuOpened={showMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-[70px] overflow-y-auto bg-whitesmoke-100 min-h-[calc(100vh-70px)] p-6">
            <button
              className="p-6 -ml-6 lg:hidden"
              name="hamburger"
              onClick={toggleMenu}
            >
              <svg
                fill="none"
                height="21"
                viewBox="0 0 30 21"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2H28.7143"
                  stroke="#212B36"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M2 10.5H28.7143"
                  stroke="#212B36"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M2 19H19"
                  stroke="#212B36"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </button>
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
