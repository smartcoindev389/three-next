import { FC, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ProductImageProps extends ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  className: string;
}

const ProductImage: FC<ProductImageProps> = ({ className, alt, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 animate-pulse z-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <Image
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
        placeholder={props.blurDataURL ? "blur" : "empty"}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
};

export default ProductImage;
