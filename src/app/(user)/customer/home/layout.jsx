"use client";

import { useRef } from "react";

import Navbar from "@/shared/components/(user)/Navbar/Navbar";
import Footer from "@/shared/components/(common)/Footer/Footer";

export default function DashboardLayout(props) {
  const { children } = props;
  const mainRef = useRef();

  return (
    <>
      <div className="h-screen flex">
        <div ref={mainRef} className={`transition-all w-full`}>
          <Navbar full={true} />
          <div className="mt-[70px] overflow-y-auto bg-[#001322] min-h-[calc(100vh-70px)]">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
