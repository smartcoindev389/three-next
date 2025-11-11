import { FC, useEffect, useState } from "react";
import { Rating } from "@material-tailwind/react";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import MediaUploader from "./ReviewForm/MediaUploader";
import styles from "./styles.module.scss";

import {
  GET_CUSTOMER_REVIEW_TOKEN,
  GET_REVIEW_RATiNGS_METADATA,
  ADD_ADVANCED_REVIEW,
} from "@/lib/apollo/queryes/product";
import ReviewSuccess from "@/shared/components/(common)/Reviews/ReviewSuccess";
import { parseProductName } from "@/utils/utils";

export interface Product {
  id: string;
  name: string;
  product_sku: string;
  image: {
    label: string;
    url: string;
  };
}

export interface Order {
  id: string;
  shipping_address: {
    firstname: string;
    lastname: string;
  };
}

interface ReviewFormData {
  product: Product;
  order: Order;
  hash: string;
}

interface UploadedFile {
  name: string;
  type: string;
  url: string;
}

const ReviewForm: FC<ReviewFormData> = ({ product, order, hash }) => {
  const { t } = useTranslation();
  const [submitDisable, setSubmitDisable] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [
    createAdvReview,
    { data: reviewData, loading: reviewLoading, error: reviewError },
  ] = useMutation(ADD_ADVANCED_REVIEW);
  const { data: customerReview } = useQuery(GET_CUSTOMER_REVIEW_TOKEN);
  const { data: ratingMapping } = useQuery(GET_REVIEW_RATiNGS_METADATA);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (customerReview) {
      // const filteredReviews = customerReview.customer.reviews.items.filter(
      //   (review) => {
      //     return review.product.sku === product.product_sku;
      //   },
      // );
      // if (filteredReviews.length > 0) {
      //   setHasReview(true);
      // }
    }
  }, [customerReview, product]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setSubmitDisable(false);
  };

  const handleSubmit = async () => {
    const ratingItem = ratingMapping?.productReviewRatingsMetadata?.items?.[0];
    const ratingValue = ratingItem?.values.find(
      (v: { value: string }) => Number(v.value) === rating,
    );
    const ratings = JSON.stringify({
      [atob(ratingItem.id)]: atob(ratingValue.value_id),
    });
    const tmp_images_path = uploadedFiles
      .filter((file) => file.type === "image")
      .map((image) => image.name);
    const tmp_video_path = uploadedFiles
      .filter((file) => file.type === "video")
      .map((image) => image.url);
    const input = {
      hash: hash,
      product_id: product.id,
      ratings,
      nickname: `${order.shipping_address.firstname} ${order.shipping_address.lastname}`,
      title,
      detail: review,
      tmp_images_path: tmp_images_path,
      tmp_video_path: tmp_video_path[0],
    };

    await createAdvReview({ variables: { input } });

    setDone(true);
  };

  if (done) return <ReviewSuccess />;

  const { brand, productName, category } = parseProductName(product.name);

  return (
    <article className="text-[1.25rem] max-w-5xl py-36 px-5 mx-auto leading-[115%]">
      <h2 className="text-5xl font-bold text-center font-din-condensed py-4 text-paragraph">
        {t("Your Opinion Matters!")}
      </h2>
      <p className="max-w-2xl mx-auto font-thin md:font-medium tracking-[0%] text-center text-slategray-400 py-4 font-sf-pro">
        {t(
          "We'd love to know how everything worked out with you. Please take a moment to review your recent purchase.",
        )}
      </p>

      <div className="py-14">
        <div className="w-1/2 pr-7 md:pr-12 pt-1 float-left">
          <Image
            alt={product?.image?.label}
            className="w-full max-w-[100px] md:max-w-[180px] ml-auto"
            height={180}
            src={product?.image?.url}
            width={180}
          />
        </div>
        <div className="pl-4 text-left min-h-[200px]">
          <p className="font-bold text-slategray-400 font-sf-pro">{brand}</p>
          <div className="pt-2 pb-5 text-paragraph">
            <p className="text-[1.25rem] md:text-2xl pt-4 md:pt-2 font-sf-pro-display font-thin">
              {productName}
            </p>
            <p className="text-[1.75rem] py-2 font-din-condensed font-bold">
              {category}
            </p>
          </div>
          <div className="text-center md:text-left pt-4 md:pt-0">
            <label className="font-semibold text-[1rem] md:text-xl block text-paragraph">
              {t("How was the item?")}
            </label>
            <Rating
              className={`${styles.rating} text-blue pt-1 -ml-1 justify-center`}
              ratedColor="blue"
              unratedColor="blue-gray"
              value={rating}
              onChange={handleRatingChange}
            />
          </div>
        </div>
      </div>

      <p className="flex w-full mb-[15px] font-semibold text-[20px] leading-[100%] tracking-[0%] font-sf-pro text-left">
        {t("Write a review")}
      </p>
      <textarea
        className="focus:outline-none focus:ring-0 focus:border-transparent flex w-full font-normal text-xl mb-[24px] px-[25px] py-[15px] max-h-[155px] h-full border-none shadow-[inset_0px_2px_4px_0px_#00000026] rounded mb-2 focus:outline-none bg-[#F5F5F5] placeholder:text-[#74788D]"
        placeholder={t("What should customers know?")}
        rows={4}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <MediaUploader onChange={setUploadedFiles} />
      <p className="flex w-full mb-[15px] font-semibold text-[20px] leading-[100%] tracking-[0%] font-sf-pro text-left">
        {t("Title your review")}
      </p>
      <input
        className="focus:outline-none focus:ring-0 focus:border-transparent w-full font-normal text-xl p-2 border-none shadow-[inset_0px_2px_4px_0px_#00000026] rounded mb-2 focus:outline-none bg-[#F5F5F5] placeholder:text-[#74788D] rounded-[10px] gap-[10px] pt-[15px] pr-[25px] pb-[15px] pl-[25px]"
        placeholder={t("What's most important to know?")}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="mt-[15px] mr-auto font-semibold text-xl bg-[#00C0F3] text-white p-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed w-[181px] h-[55px] rounded-[10px] px-[33px] py-[15px] gap-[10px]"
        disabled={submitDisable}
        onClick={handleSubmit}
      >
        {t("Submit")}
      </button>
    </article>
  );
};

export default ReviewForm;
