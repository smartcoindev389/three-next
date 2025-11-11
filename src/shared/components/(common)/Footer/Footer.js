"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import delve from "dlv";
import { useTranslation } from "react-i18next";

import { strapi } from "@/lib/strapi/strapi";
import SiInstagram from "@/assets/icons/inline-svg/instagram.svg";
import SiLinkedin from "@/assets/icons/inline-svg/linkedin.svg";
import SiYoutube from "@/assets/icons/inline-svg/youtube.svg";
import SiReddit from "@/assets/icons/inline-svg/reddit.svg";
import SiFacebook from "@/assets/icons/inline-svg/facebook.svg";
import SiPinterest from "@/assets/icons/inline-svg/pinterest.svg";
import SiTelegram from "@/assets/icons/inline-svg/telegram.svg";
import RiTwitterXLine from "@/assets/icons/inline-svg/twitter.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  FooterAccordionTrigger,
} from "@/shared/components/(common)/ui/accordion";

export default function Footer(props) {
  const { t } = useTranslation();
  const [data, setData] = useState(props.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        strapi.getPageFooter().then((responseData) => {
          setData(responseData.data);
        });
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
  }, [t]);

  const SocialNetworks = useMemo(() => {
    if (!data?.social_links) return [];

    const socialLinks = data.social_links.reduce((acc, link) => {
      acc[link.social_network] = link.url;

      return acc;
    }, {});

    return [
      { Component: SiLinkedin, social_network: "linkedin" },
      { Component: SiReddit, social_network: "reddit" },
      { Component: SiFacebook, social_network: "facebook" },
      { Component: SiYoutube, social_network: "youtube" },
      { Component: SiPinterest, social_network: "pinterest" },
      { Component: SiInstagram, social_network: "instagram" },
      { Component: SiTelegram, social_network: "telegram" },
      { Component: RiTwitterXLine, social_network: "twitter" },
    ]
      .map(({ Component, social_network }) => ({
        Component,
        href: socialLinks[social_network] || null,
      }))
      .filter((link) => link.href);
  }, [data?.social_links]);

  if (!data) return null;

  return (
    <footer className="w-full text-gray-700 bg-blue">
      <div className="container flex flex-col flex-wrap gap-x-10 px-6 py-12 mx-auto md:items-center lg:items-start justify-center md:flex-row md:flex-no-wrap">
        <div className="text-left basis-64 grow md:pb-6 xl:px-4">
          <span className="flex items-center font-semibold text-[#434345] justify-start">
            <h3 className="text-2xl md:text-xl text-[#434345] font-semibold">
              {delve(data, "logo")}
            </h3>
          </span>
          <p className="mt-5 text-base font-normal text-white">
            {delve(data, "description")}
          </p>
          <div className="mt-7">
            <span className="inline-flex items-center mt-2 sm:ml-auto sm:mt-0 justify-start gap-2">
              {SocialNetworks.map(({ href, Component }) => (
                <Link
                  key={href}
                  className="text-white cursor-pointer hover:text-sky-300"
                  href={href}
                  target="_blank"
                >
                  <Component />
                </Link>
              ))}
            </span>
          </div>
        </div>
        <div className="flex-wrap flex-grow mt-10 -mb-10 text-center md:mt-0 md:text-left hidden xl:flex">
          <div className="w-full px-4 lg:w-1/4 md:w-1/2">
            <h2 className="mb-5 text-xl font-semibold tracking-widest text-[#434345] uppercase">
              contact
            </h2>
            <nav className="mb-10 list-none">
              {data.contact?.map((item) => (
                <li
                  key={item.id}
                  className="mt-1 flex gap-3 items-center justify-center md:justify-start"
                >
                  <div className="text-white text-base">{item.content}</div>
                </li>
              ))}
            </nav>
          </div>
          {data.columns?.map((col) => (
            <div key={col.id} className="w-full px-4 lg:w-1/4 md:w-1/2">
              <h2 className="mb-5 text-xl font-semibold tracking-widest text-[#434345] uppercase">
                {col.title}
              </h2>
              <nav className="mb-10 list-none font-medium">
                {col.links.map((link) => (
                  <li key={col.id + link.id} className="mt-3">
                    <Link
                      className="text-white cursor-pointer hover:text-dimgray-100 text-base"
                      href={link.href}
                      target={link.target}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <Accordion collapsible className="w-full xl:hidden" type="single">
          <AccordionItem value="item-0">
            <FooterAccordionTrigger className="text-lg font-semibold text-[#434345] uppercase font-sf-pro-display py-2 border-b border-white border-opacity-20">
              Contact
            </FooterAccordionTrigger>
            <AccordionContent className="py-0">
              <nav className="list-none mt-2.5 pb-2.5 border-b border-white border-opacity-20">
                {data.contact?.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 items-center justify-start"
                  >
                    {item?.icon ? (
                      <Image
                        alt="Contact icon"
                        height={18}
                        src={
                          process.env.NEXT_PUBLIC_STRAPI_URL + item?.icon?.url
                        }
                        width={18}
                      />
                    ) : (
                      <div className="w-[18px]" />
                    )}
                    <div className="text-white text-base">{item.content}</div>
                  </li>
                ))}
              </nav>
            </AccordionContent>
          </AccordionItem>
          {data.columns?.map((col, idx) => (
            <AccordionItem key={col.id} value={`item-${idx + 1}`}>
              <FooterAccordionTrigger className="text-lg font-semibold tracking-widest text-[#434345] uppercase py-2 border-b border-white border-opacity-20">
                {col.title}
              </FooterAccordionTrigger>
              <AccordionContent className="py-0">
                <nav className="list-none font-medium pb-2.5 border-b border-white border-opacity-20">
                  {col.links.map((link) => (
                    <li key={col.id + link.id} className="mt-2.5">
                      <Link
                        className="text-white cursor-pointer hover:text-dimgray-100 text-base"
                        href={link.href}
                        target={link.target}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </nav>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="bg-[#00AFDD]">
        <div className="container px-5 py-4 mx-auto">
          <p className="font-medium text-sm text-white capitalize xl:text-center max-lg:text-center flex justify-center items-center max-md:flex-col">
            Ⓡ/TM/©2025 FUR4, LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
