"use client";

import { Rating } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FC } from "react";

import styles from "./styles.module.scss";

import { parseProductName } from "@/utils/utils";

interface Review {
  average_rating: number;
  product: {
    image: {
      label: string;
      url: string;
    };
    name: string;
  };
  summary: string;
  text: string;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  const { t } = useTranslation();
  const rating = Math.round(review.average_rating / 20);
  const { category, productName } = parseProductName(review.product.name);

  return (
    <div className="border rounded-md p-4 shadow-md mb-4 bg-white">
      <div className="flex flex-col md:flex-row py-6 px-6">
        <div className="w-full max-w-[200px] shrink-0">
          <Image
            alt={review.product.image.label || "Product image"}
            className="w-full h-auto"
            height={200}
            src={review?.product.image.url || "/assets/projects/preview.png"}
            width={200}
          />
        </div>
        <div className="md:pl-12 pt-8 md:pt-0 text-left">
          <div className="text-paragraph md:flex flex-wrap items-baseline">
            <p className="text-[1.5rem] font-thin font-sf-pro md:pr-2">
              {productName}
            </p>
            <p className="text-[1.8rem] leading-[115%] font-bold font-din-condensed">
              {category}
            </p>
          </div>
          <Rating
            readonly
            className={`${styles.rating_card} text-blue py-4 -ml-1 justify-center`}
            ratedColor="blue"
            unratedColor="blue-gray"
            value={rating}
          />
          <label
            className={`${styles.review_card_review_title} font-semibold text-lg md:text-xl block text-paragraph pb-4`}
          >
            {review.summary}
          </label>
          <p
            className={`${styles.review_label} text-paragraph font-bold font-sf-pro mb-2`}
          >
            {t("Reviewed on")} {review.created_at}
          </p>
          <p
            className={`${styles.review_card_text} text-paragraph font-bold font-sf-pro`}
          >
            {review.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
