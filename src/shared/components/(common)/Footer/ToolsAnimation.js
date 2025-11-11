import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslation } from "react-i18next";

import { GET_CATEGORY_PRODUCTS } from "@/lib/apollo/queryes/category";
import { cn } from "@/utils/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ORDER = [
  "FUR4 deShedding Tool - Long Hair Dog",
  "FUR4 deShedding Tool - Short Hair Dog",
  "FUR4 deShedding Tool - Long Hair Cat",
  "FUR4 deShedding Tool - Short Hair Cat",
];

const ToolsAnimation = () => {
  const { t } = useTranslation();
  const container = useRef();
  const { data } = useQuery(GET_CATEGORY_PRODUCTS);
  const products = data?.products?.items || [];
  const sortedProducts = [...products].sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));

  return (
    <section ref={container} className="h-fit">
      <div className="container 2xl:max-w-[1620px] mx-auto overflow-hidden flex flex-col justify-center items-center gap-10 pb-24">
        <div className="pt-20 text-[80px] font-bold text-center font-din-condensed leading-[75px] text-gray-500 max-md:pt-5 max-md:px-5 max-md:max-w-full max-w-[1000px] max-md:text-6xl max-md:leading-[52px] z-[20]">
          {t("The best tool FUR your FOUR Legged friends")}
        </div>

        <div className="grid grid-cols-2 md:flex gap-y-2.5 gap-x-3 md:gap-4 ">
          {sortedProducts.map((card, index) => (
            <Card key={index} img={card?.image?.url} path={card?.url_key} title={card?.name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsAnimation;

const Card = ({ logo, img, title, subTitle, className, path, ...props }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className={cn(
        "w-[calc(158/360*100vw)] h-[calc(231/360*100vw)] md:w-[328px] md:h-[451px] flex flex-col items-center justify-center bg-white relative ",
        "rounded-[18px] shadow-[0px_4px_6.1px_0px_rgba(0,0,0,0.23)]",
        className,
      )}
      {...props}
    >
      <div className="relative h-[calc(151/360*100vw)] w-[calc(110/360*100vw)] md:h-[322.15px] md:w-[232.53px]">
        <Image fill alt={title} className="object-contain" src={img} />
      </div>
      <button
        className={`bg-blue w-fit px-5 md:px-10 my-2 py-2 text-white text-md md:text-2xl rounded-full hover:bg-green-300 hover:cursor-pointer`}
        onClick={() => {
          router.push("/products/" + path);
        }}
      >
        + {t("Learn More")}
      </button>
    </div>
  );
};
