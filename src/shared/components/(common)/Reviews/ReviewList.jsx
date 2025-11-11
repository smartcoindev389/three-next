"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";

import Loader from "@/shared/components/(common)/Loader/Loader";
import ReviewCard from "@/shared/components/(common)/Reviews/ReviewCard";
import { GET_CUSTOMER_REVIEW_TOKEN } from "@/lib/apollo/queryes/product";
import Title from "@/shared/components/(common)/Title/Title";

/**
 * Displays a list of customer reviews fetched from a GraphQL query
 * @example
 * ReviewList()
 * Returns JSX component with list of reviews or message indicating no reviews
 * @returns {JSX.Element} A rendered list of customer reviews wrapped in JSX elements.
 * @description
 *   - The function relies on `useState` to manage review data locally and `useQuery` to fetch data from a GraphQL endpoint.
 *   - Utilizes `useEffect` to automatically update the review data state when new data is retrieved.
 *   - Renders a header displaying overall review count and lists each review using the `ReviewCard` component.
 *   - Displays a message if no reviews are available.
 */
const ReviewList = () => {
  const [reviewData, setReviewData] = useState([]);
  const { data } = useQuery(GET_CUSTOMER_REVIEW_TOKEN);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReviewData(data?.customer?.reviews);
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="w-full min-h-full bg-whitesmoke-100 overflow-hidden tracking-normal text-left text-11xl text-black font-sf-pro-display">
      <main>
        <div>
          <Title className="text-paragraph text-[1.75rem]">
            {t("Reviews")}
          </Title>
          <p
            className={`${styles.review_list_qty_font} mt-6 md:mt-12 mb-6 font-[500] text-lg md:text-xl`}
          >
            {t("Product Reviews")}: {reviewData?.items?.length ?? 0}
          </p>
          {reviewData?.items && reviewData?.items?.length > 0 ? (
            reviewData.items.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))
          ) : (
            <div className="text-center text-gray-500">
              {loading ? (
                <Loader className={"!bg-transparent"} />
              ) : (
                <>{t("No reviews available")}</>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReviewList;
