"use client";

import { useRef, useState, useEffect, memo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import delve from "dlv";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { debounce } from "lodash-es";

import LiquidButton from "./LiquidButton";

import header from "@/assets/icons/logo.png";
import cartIcon from "@/assets/icons/cart.svg";
import AudioOn from "@/assets/icons/audio-on.gif";
import AudioOff from "@/assets/icons/line.svg";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import StoreSwitcher from "@/shared/components/(common)/StoreSwitcher/StoreSwitcher";
import CurrencySwitcher from "@/shared/components/(common)/CurrencySwitcher/CurrencySwitcher";
import { strapi } from "@/lib/strapi/strapi";
import SiInstagram from "@/assets/icons/inline-svg/instagram.svg";
import SiLinkedin from "@/assets/icons/inline-svg/linkedin.svg";
import SiYoutube from "@/assets/icons/inline-svg/youtube.svg";
import SiReddit from "@/assets/icons/inline-svg/reddit.svg";
import SiFacebook from "@/assets/icons/inline-svg/facebook.svg";
import SiPinterest from "@/assets/icons/inline-svg/pinterest.svg";
import SiTelegram from "@/assets/icons/inline-svg/telegram.svg";
import RiTwitterXLine from "@/assets/icons/inline-svg/twitter.svg";
import { SUBSCRIBE_EMAIL_TO_NEWSLETTER } from "@/lib/apollo/queryes/newletter";
import AccountMenu from "@/shared/components/(common)/AccountMenu/AccountMenu";
import { useCart } from "@/providers/CartProvider/useCart";

const HAMBURGER_VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
    },
  },
};

const UNDERLAY_VARIANTS = {
  open: {
    width: "calc(100% - 32px)",
    height: "calc(100vh - 32px)",
    transition: { type: "spring", mass: 3, stiffness: 400, damping: 50 },
  },
  closed: {
    transition: {
      delay: 0.75,
      type: "spring",
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  },
};

function Header(props) {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState(false);
  const { pathname } = usePathname();
  const container = useRef();
  const backRef = useRef();
  const audioRef = useRef();
  const buyRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [data, setData] = useState(props.data);

  const { cart } = useCart();
  const navigate = useRouter();
  const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const audioPlay = (ev) => {
    setPlaying(!playing);

    if (playing) {
      audioRef.current.muted = true;
      audioRef.current.pause();
    } else {
      audioRef.current.muted = false;
      audioRef.current.play();
    }
    if (ev.currentTarget.classList.contains("playing")) {
      ev.currentTarget.classList.remove("paused", "playing");
      ev.currentTarget.classList.add("paused");
    } else if (ev.currentTarget.classList.contains("paused")) {
      ev.currentTarget.classList.add("playing");
    }
    if (!ev.currentTarget.classList.contains("paused")) {
      ev.currentTarget.classList.add("paused");
    }
  };

  useEffect(() => {
    setCartTotalQty(cart?.total_quantity || 0);
  }, [cart?.total_quantity]);

  useEffect(() => {
    const fetchHeaderData = debounce(async () => {
      try {
        const headerData = await strapi.getPageHeader();

        setData(headerData.data);
      } catch (error) {
        console.error("Header data fetch error:", error);
      }
    }, 300);

    if (!data) fetchHeaderData();

    return () => fetchHeaderData.cancel();
  }, [i18n.language]);

  useEffect(() => backToTop(), [pathname]);

  useEffect(() => {
    if (buyRef.current) {
      buyRef.current.liquidButton = new LiquidButton(buyRef.current);
    }
  }, [i18n.language, data]);

  return data ? (
    <>
      <div ref={container} className="header fixed top-0 flex items-center w-screen justify-center z-[999] pb-4 h-fit">
        <audio ref={audioRef} autoPlay loop muted={true} src="/background.mp3" />
        <div
          className="flex justify-between items-center px-5 w-full max-w-screen max-md:flex-wrap max-md:max-w-full bg-[var(--header-background,_#ffffff)]"
          id="header"
        >
          <Link className="cursor-pointer" href="/">
            <Image
              alt={t("logo")}
              className="object-center self-stretch max-w-full aspect-[1.15] my-2 w-20 ml-1 md:ml-4 max-md:w-[57px] max-md:h-[50px]"
              loading="lazy"
              src={header}
            />
          </Link>
          <div
            className={`flex justify-between items-center self-stretch my-auto font-medium whitespace-nowrap ${
              pathname === "/" ? "mr-[248px]" : "mr-16"
            } max-md:mr-8 -mt-2 max-md:-mt-2 max-md:left-5`}
          >
            <button
              aria-label={t("Audio On/Off")}
              className={`w-12 h-12 mt-0 p-2 rounded-full justify-center items-center bg-sky-500 ${pathname === "/" ? "hidden md:flex" : "hidden"}`}
              onClick={audioPlay}
            >
              <Image
                alt={t("playing")}
                className="object-center object-fill max-w-full aspect-auto transition-all"
                height={23}
                loading="lazy"
                src={playing ? AudioOn : AudioOff}
                width={23}
              />
            </button>
            <Link
              className="hover:text-indigo-300 rounded-full mt-5 w-16 h-16 md:w-20 md:h-20 px-2 md:px-3 relative"
              href="/shopping-cart"
            >
              <Image
                alt={t("Cart")}
                className="object-center self-stretch aspect-square"
                height={62}
                loading="lazy"
                src={cartIcon}
                width={62}
              />
              <span className="absolute text-xs md:text-[14px] top-1.5 md:top-[10px] right-1.5 md:right-[10px] text-white bg-gradient-to-br from-sky-600 to-sky-500 shadow-lg shadow-sky-800/20 px-1.5 md:px-[8px] py-0.5 md:py-[3px] rounded-full">
                {cartTotalQty}
              </span>
            </Link>
            <svg
              ref={buyRef}
              className={`cursor-pointer relative -ml-6 ${
                pathname === "/" ? "mt-1 md:fixed md:-top-[10px] md:right-20" : "md:-ml-3 max-md:mt-1"
              }`}
              data-color1="#b06be0"
              data-color2="#8F17E1"
              data-color3="#a338e0"
              data-height={window.innerWidth < 768 ? 40 : 50}
              data-text={window.innerWidth < 768 ? t("BUY") : t("BUY NOW")}
              data-width={window.innerWidth < 768 ? 100 : 150}
              onClick={() => navigate.push("/products")}
            />

            <div className="flex justify-between items-stretch self-stretch my-auto">
              <Nav
                active={active}
                audioPlay={audioPlay}
                cartTotalQty={cartTotalQty}
                data={data}
                playing={playing}
                setActive={setActive}
                {...props}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        ref={backRef}
        data-te-ripple-init
        className="!fixed bottom-8 md:bottom-8 right-5 rounded-full bg-sky-600 shadow-sky-800/20 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg z-[2222]"
        data-te-ripple-color="light"
        id="btn-back-to-top"
        type="button"
        onClick={backToTop}
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          data-prefix="fas"
          focusable="false"
          role="img"
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
            fill="currentColor"
          />
        </svg>
      </button>
    </>
  ) : (
    ""
  );
}

const Nav = memo((props) => {
  useEffect(() => {
    const event = new CustomEvent("lenis-scroll-control", {
      detail: props.active ? "stop" : "start",
    });

    window.dispatchEvent(event);

    return () => {
      window.dispatchEvent(new CustomEvent("lenis-scroll-control", { detail: "start" }));
    };
  }, [props.active]);

  return (
    <>
      <HamburgerButton active={props.active} setActive={props.setActive} />
      <AnimatePresence>
        {props.active && <LinksOverlay active={props.active} setActive={props.setActive} {...props} />}
      </AnimatePresence>
    </>
  );
});

const LinksOverlay = memo((props) => {
  const { t } = useTranslation();
  const [customer, setCustomer] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const lsUser = localStorage.getItem("token");

    setCustomer(lsUser);
  }, []);

  useEffect(() => {
    if (ref.current && !ref.current.liquidButton) ref.current.liquidButton = new LiquidButton(ref.current);
  });

  return (
    <nav className="fixed right-4 top-2 h-[calc(100vh_-_32px)] w-[calc(100%_-_32px)] overflow-hidden z-[60]">
      <div className={"h-full flex flex-col w-full overflow-hidden max-sm:overflow-x-hidden"} data-lenis-prevent="true">
        <Logo {...props} />
        <motion.div
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.75,
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
          className="flex items-center md:ml-10 md:hidden"
          exit={{ opacity: 0, y: -8 }}
          initial={{ opacity: 0, y: -8 }}
        >
          <Link href={"/products"} onClick={() => props.setActive(false)}>
            <motion.svg ref={ref} className={`cursor-pointer relative z-[70] -my-5`} data-text={t("BUY NOW")} />
          </Link>
          <button
            className={`w-12 h-12 mt-0 p-2 flex rounded-full justify-center items-center bg-sky-500`}
            onClick={props.audioPlay}
          >
            <Image
              alt={t("playing")}
              className="object-center object-fill max-w-full aspect-auto transition-all"
              height={23}
              loading="lazy"
              src={props.playing ? AudioOn : AudioOff}
              width={23}
            />
          </button>
          <Link
            className="hover:text-indigo-300 rounded-full w-16 h-16 md:w-20 md:h-20 px-3 relative flex"
            href="/shopping-cart"
            onClick={() => {
              props.setActive(false);
            }}
          >
            <Image
              alt={t("Cart")}
              className="object-center self-stretch aspect-square"
              height={62}
              loading="lazy"
              src={cartIcon}
              width={62}
            />
            <span className="absolute text-xs md:text-[14px] top-1.5 md:top-[10px] right-1.5 md:right-[10px] text-white bg-gradient-to-br from-sky-600 to-sky-500 shadow-lg shadow-sky-800/20 px-1.5 md:px-[8px] py-0.5 md:py-[3px] rounded-full">
              {props.cartTotalQty}
            </span>
          </Link>
        </motion.div>
        <LinksContainer {...props} />
        {customer ? (
          <AccountMenu active={props.active} setActive={props.setActive} />
        ) : (
          <AuthButtons active={props.active} setActive={props.setActive} />
        )}
        <Newsletter />
        <FooterCTAs {...props} />
      </div>
    </nav>
  );
});

const AuthButtons = memo((props) => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.75, duration: 0.5, ease: "easeInOut" },
      }}
      className="flex items-center gap-2 mt-3 md:mt-6 p-2 pl-4 sm:pl-10 md:pl-20 "
      exit={{ opacity: 0, y: -12 }}
      initial={{ opacity: 0, y: -12 }}
    >
      <Link
        className="block text-center px-7 md:px-10 py-2 bg-sky-700 text-sky-200 rounded-lg font-medium text-xl md:text-2xl h-fit hover:opacity-70"
        href="/login"
        onClick={() => props.setActive(false)}
      >
        {t("Sign In")}
      </Link>
      <Link
        className="block text-center px-7 md:px-10 py-2 bg-sky-700 text-sky-200 rounded-lg font-medium text-xl md:text-2xl -fit hover:opacity-70 "
        href="/register"
        onClick={() => props.setActive(false)}
      >
        {t("Sign Up")}
      </Link>
    </motion.div>
  );
});

const LinksContainer = memo((props) => {
  return (
    <motion.div className="space-y-2 md:space-y-4 p-2 pl-4 sm:pl-10 md:pl-20 ">
      {delve(props, "data.links").map((l, idx) => {
        return (
          <NavLink key={l.label} href={l.href} idx={idx} setActive={props.setActive}>
            {l.label}
          </NavLink>
        );
      })}
    </motion.div>
  );
});

const NavLink = memo(({ children, href, idx, setActive }) => {
  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.75 + idx * 0.125,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      className="block text-5xl font-medium text-[#E0E0E0] transition-colors hover:text-white hover:font-bold max-md:text-2xl"
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: -8 }}
    >
      <Link href={href} onClick={() => setActive(false)}>
        {children}
      </Link>
    </motion.div>
  );
});

const Logo = memo((props) => {
  const { t, i18n } = useTranslation();
  const ref = useRef();
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current && !ref.current.liquidButton) ref.current.liquidButton = new LiquidButton(ref.current);
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.liquidButton = new LiquidButton(ref.current);
    }
  }, [i18n.language]);

  return (
    <motion.div className="relative z-30 flex flex-row justify-start items-center gap-5 max-md:gap-2 max-sm:px-4 max-sm:pt-6 max-sm:pb-2">
      <motion.div
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.5, duration: 0.5, ease: "easeInOut" },
        }}
        className="grid h-24 w-24 md:mt-2 md:ml-4 place-content-center rounded-br-xl rounded-tl-xl transition-colors max-sm:hidden"
        exit={{ opacity: 0, y: -12 }}
        initial={{ opacity: 0, y: -12 }}
      >
        <Link href="/">
          <Image
            alt={t("logo")}
            className="object-center self-stretch max-w-full aspect-[1.15] w-32 max-md:w-20"
            loading="lazy"
            src={header}
          />
        </Link>
      </motion.div>
      <Suspense fallback={null}>
        <CurrencySwitcher />
        <StoreSwitcher />
      </Suspense>
      <motion.div
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.75,
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        className="items-center md:ml-10 hidden md:flex"
        exit={{ opacity: 0, y: -8 }}
        initial={{ opacity: 0, y: -8 }}
      >
        <Link href={"/products"} onClick={() => props.setActive(false)}>
          <motion.svg
            ref={ref}
            className={`cursor-pointer relative z-20 -my-5`}
            // onClick={() => navigate('/products')}
            data-text={t("BUY NOW")}
          />
        </Link>
        <button
          className={`w-12 h-12 p-2 rounded-full flex justify-center items-center bg-sky-500 ${
            pathname === "/" ? "block" : "hidden"
          }`}
          onClick={props.audioPlay}
        >
          <Image
            alt={t("playing")}
            className="object-center object-fill max-w-full aspect-auto transition-all"
            height={23}
            loading="lazy"
            src={props.playing ? AudioOn : AudioOff}
            width={23}
          />
        </button>
        <Link
          className="hover:text-indigo-300 rounded-full w-16 h-16 md:w-20 md:h-20 px-3 mt-5 relative"
          href="/shopping-cart"
          onClick={() => {
            props.setActive(false);
          }}
        >
          <Image
            alt={t("Cart")}
            className="object-center self-stretch aspect-square"
            height={62}
            loading="lazy"
            src={cartIcon}
            width={62}
          />
          <span className="absolute text-[14px] top-[10px] right-[10px] text-white bg-gradient-to-br from-sky-600 to-sky-500 shadow-lg shadow-sky-800/20 px-[8px] py-[3px] rounded-full">
            {props.cartTotalQty}
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
});

const HamburgerButton = memo(({ active, setActive }) => {
  const container = useRef();
  const iconRef = useRef();

  return (
    <>
      <motion.div
        ref={container}
        animate={active ? "open" : "closed"}
        className="fixed z-[55] top-2 max-md:top-5 right-4 max-md:right-4 rounded-xl w-16 h-16 max-md:w-11 max-md:h-10 bg-gradient-to-br from-sky-600 to-sky-500 shadow-lg shadow-sky-800/20"
        initial={false}
        variants={UNDERLAY_VARIANTS}
      />

      <motion.button
        ref={iconRef}
        animate={active ? "open" : "closed"}
        className={`group fixed right-4 max-md:right-4 top-2 max-md:top-5 z-[602] h-16 w-16 max-md:w-11 max-md:h-10 bg-white/0 hover:bg-white/20 ${
          active ? "rounded-bl-xl rounded-tr-xl" : "rounded-xl"
        }`}
        initial={false}
        onClick={() => setActive((pv) => !pv)}
      >
        <motion.span
          className="absolute block h-1 w-7 max-md:w-5 bg-white"
          style={{ y: "-50%", left: "50%", x: "-50%" }}
          variants={HAMBURGER_VARIANTS.top}
        />
        <motion.span
          className="absolute block h-1 w-7 bg-white max-md:w-5"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
          variants={HAMBURGER_VARIANTS.middle}
        />
        <motion.span
          className="absolute block h-1 w-4 bg-white max-md:w-3 left-[58%] max-md:left-[57%]"
          style={{ x: "-50%", y: "50%" }}
          variants={HAMBURGER_VARIANTS.bottom}
        />
      </motion.button>
    </>
  );
});

const FooterCTAs = memo((props) => {
  const { i18n } = useTranslation();
  const buyRef = useRef();
  const [SocialNetworks, setSocialNetworks] = useState([]);

  useEffect(() => {
    const func = async () => {
      const data = props.data.SocialLinks;

      const socialNetworksConfig = [
        { network: "linkedin", Component: SiLinkedin },
        { network: "reddit", Component: SiReddit },
        { network: "facebook", Component: SiFacebook },
        { network: "youtube", Component: SiYoutube },
        { network: "pinterest", Component: SiPinterest },
        { network: "instagram", Component: SiInstagram },
        { network: "telegram", Component: SiTelegram },
        { network: "twitter", Component: RiTwitterXLine },
      ];

      const networks = socialNetworksConfig
        .map(({ network, Component }) => {
          const networkData = data.find((item) => item.social_network === network);

          if (!networkData?.url) return null;

          return {
            Component,
            href: networkData.url,
          };
        })
        .filter(Boolean);

      setSocialNetworks(networks);
    };

    func();
  }, [props.data.SocialLinks]);

  useEffect(() => {
    if (buyRef.current && !buyRef.current.liquidButton) buyRef.current.liquidButton = new LiquidButton(buyRef.current);
  });
  useEffect(() => {
    if (buyRef.current) {
      buyRef.current.liquidButton = new LiquidButton(buyRef.current);
    }
  }, [i18n.language]);

  return (
    <div className="flex gap-4 items-center md:pl-20 mt-auto pt-2 pl-4 sm:pl-10 pb-24 md:pb-8">
      {SocialNetworks.map(({ Component, href }, idx) => {
        return (
          <motion.a
            key={href}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 1 + idx * 0.125,
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
            exit={{ opacity: 0, y: -8 }}
            href={href}
            initial={{ opacity: 0, y: -8 }}
          >
            <Component />
          </motion.a>
        );
      })}
    </div>
  );
});

const Newsletter = memo(() => {
  const { t } = useTranslation();
  const [subscribeEmailToNewsletter, { loading }] = useMutation(SUBSCRIBE_EMAIL_TO_NEWSLETTER);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const onSubmit = () => {
    if (!email) {
      toast({ type: "alert", description: t("Please, fill the email field to subscribe.") });

      return;
    }

    subscribeEmailToNewsletter({
      variables: {
        email: email,
      },
      onCompleted: (data) => {
        setEmail("");
        toast({ type: "success", description: t("Subscription has been succeeded! Thank you!") });
      },
      onError: (error) => {
        const errorData = error?.graphQLErrors[0];

        if (errorData?.extensions?.category === "graphql-already-exists") {
          toast({
            type: "error",
            description: t("Looks like you're already subscribed to our newsletter! No need to subscribe again."),
          });

          return;
        }

        toast({ type: "error", description: t("Subscription has been failed. Please, try again later.") });
      },
    });
  };

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.75 + 6 * 0.125,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: -8 }}
    >
      <section>
        <div className="py-4 px-6 mx-14 max-w-screen-md max-md:mx-4 lg:py-6 lg:px-6 max-sm:pl-4 max-sm:m-0">
          <div className="max-w-screen-md md:text-center max-md:text-center">
            <p className="font-sf-pro-display text-pretty break-words mb-4 max-w-xl text-start font-normal text-white md:mb-5 text-[40px] max-md:text-xl w-[400px] sm:w-3/4">
              {t("Subscribe to our newsletter")} {window.innerWidth < 768 ? <br /> : ""} {t("for updates!")}
            </p>
            <div>
              <div
                className={`items-center mb-3 max-w-screen-md flex space-y-0 ${loading ? "opacity-90 pointer-events-none" : ""}`}
              >
                <div className="relative w-1/2 max-md:w-3/4">
                  <label className="hidden mb-2 text-md font-medium text-gray-900" htmlFor="email">
                    {t("Email address")}
                  </label>
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    className="block p-3 pl-10 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-none rounded-l-lg focus:ring-primary-500 focus:border-primary-500"
                    id="email"
                    placeholder={t("Enter your email")}
                    required=""
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                  />
                </div>
                <div>
                  <button
                    aria-label={t("Subscribe")}
                    className="py-3 px-5 max-md:px-2 w-full text-md font-medium text-center text-white border cursor-pointer bg-sky-400 border-sky-600 rounded-none rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
                    type="submit"
                    onClick={onSubmit}
                  >
                    {t("Subscribe")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
});

export default memo(Header);
