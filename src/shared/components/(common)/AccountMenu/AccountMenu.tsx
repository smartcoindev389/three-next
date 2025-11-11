import { useTranslation } from "react-i18next";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";

interface AccountMenuProps {
  active: boolean;
  setActive: (value: boolean) => void;
}

const AccountMenu: FC<AccountMenuProps> = ({ active, setActive }) => {
  const { t } = useTranslation();

  const handleLogout = async () => {
    localStorage.clear();
    // await signOut({ redirectTo: "/" });
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const changeRoute = () => {
    setActive(!active);
  };

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
        className="block px-5 py-2 bg-sky-700 text-sky-200 rounded-lg font-medium text-xl md:text-2xl h-fit hover:opacity-70 w-max"
        href="/customer/home"
        onClick={(e) => changeRoute()}
      >
        {t("My Account")}
      </Link>
      <button
        aria-label={t("Logout")}
        className=" block px-5 py-2 bg-sky-700 text-sky-200 rounded-lg font-medium text-xl md:text-2xl -fit hover:opacity-70  w-max"
        onClick={handleLogout}
      >
        {t("Logout")}
      </button>
    </motion.div>
  );
};

export default AccountMenu;
