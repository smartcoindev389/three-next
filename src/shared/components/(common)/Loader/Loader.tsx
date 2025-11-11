import Image from "next/image";
import { FC } from "react";

interface LoaderProps {
  className?: string;
  loaderClassName?: string;
}

const Loader: FC<LoaderProps> = ({ className = "", loaderClassName = "" }) => {
  return (
    <section
      className={`${className} bg-white w-full flex justify-center items-center`}
    >
      <Image
        alt="loading..."
        className={`animate-spin ${loaderClassName}`}
        height="52"
        src="/assets/preloader.svg"
        width="52"
      />
    </section>
  );
};

export default Loader;
