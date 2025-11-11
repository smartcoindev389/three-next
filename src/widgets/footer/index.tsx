import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReferralForm } from "providers/referral-form-provider";
import { usePathname } from "next/navigation";

interface FooterLink {
  id: number;
  label: string;
  href: string;
}

interface FooterData {
  button_text: string;
  left_description: string;
  phone: string;
  email: string;
  copyright: string;
  left_link: FooterLink[];
  right_link: FooterLink[];
}

interface IFooter {
  footerData?: FooterData;
}

export const Footer: FC<IFooter> = ({ footerData }) => {
  const { open } = useReferralForm();

  const pathname = usePathname();
  const isComing = pathname === "/coming-soon";

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Footer}`,
        start: "top center",
        toggleActions: "play none none none",
      },
    });

    tl.from(
      `.${styles.title}`,
      {
        y: -100,
        opacity: 0,
      },
      0,
    )
      .from(
        `.${styles.content}`,
        {
          y: 50,
          opacity: 0,
        },
        0.1,
      )
      .from(
        `.${styles.list} li`,
        {
          y: 50,
          opacity: 0,
          stagger: {
            from: "random",
            amount: 0.25,
          },
        },
        0.2,
      )
      .from(
        `.${styles.copyright} *`,
        {
          y: 50,
          opacity: 0,
        },
        0.3,
      )
      .fromTo(
        `.${styles.bottom}`,
        {
          boxShadow: "0 0 0 0 #2DA0FF",
        },
        { boxShadow: "0 0 60px -10px #2DA0FF" },
        1.2,
      );
  }, []);

  if (isComing) {
    return null;
  }

  // Use default values if no data is provided
  const buttonText = footerData?.button_text || "let's talk";
  const description = footerData?.left_description || "Whether you're ready to begin your project or just have a question, we're here to help.";
  const phone = footerData?.phone || "+XX XXXX XXX XXX";
  const email = footerData?.email || "info@platformz.us";
  const copyright = footerData?.copyright || `Copyright © ${new Date().getFullYear()} | Designed by Dfrnc`;
  const leftLinks = footerData?.left_link || [];
  const rightLinks = footerData?.right_link || [];

  // Contact links (phone and email)
  const contactLinks = [
    { text: email, link: `mailto:${email}` },
    { text: phone, link: `tel:${phone}` },
  ];

  return (
    <footer className={clsx(styles.Footer)}>
      <button onClick={open} className={clsx(styles.title)}>
        {buttonText}
      </button>
      <div className={clsx(styles.content)}>
        <Paragraph text={description}></Paragraph>
        {contactLinks.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            target="_blank"
            className={clsx("brackets", styles.link)}
          >
            <span className="line-appearance hover-text-wrapper">
              <span className="hover-text" data-text={item.text}>
                {item.text}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className={clsx(styles.bottom)}>
        <ul className={clsx(styles.list)}>
          {leftLinks.length > 0 &&
            leftLinks.map((item) => (
              <li key={item.id}>
                <Link
                  className={clsx(styles.link, "line-appearance")}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
        <ul className={clsx(styles.list)}>
          {rightLinks.length > 0 &&
            rightLinks.map((item) => (
              <li key={item.id}>
                <Link
                  className={clsx(styles.link, "line-appearance")}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className={clsx(styles.copyright)}>
        <span className="line-appearance">
          {copyright}
        </span>
      </div>
    </footer>
  );
};
