import { useEffect, useState } from "react";
import { Rating } from "@material-tailwind/react";
import { useFilePicker } from "use-file-picker";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import {
  GET_CUSTOMER_REVIEW_TOKEN,
  GET_REVIEW_RATiNGS_METADATA,
  ADD_ADVANCED_REVIEW,
} from "@/lib/apollo/queryes/product";

/**
 * Displays a button to add or view reviews, with an interface to submit a new review including media uploads.
 * @example
 * <ReviewButton product={product} order={order} />
 * Renders a button which when clicked, allows the user to add a review for a product order.
 * @param {Object} props - The component props.
 * @param {Object} props.product - The product data.
 * @param {Object} props.product.product - The product object containing `id` and other product info.
 * @param {string} props.product.product_sku - The product SKU used to match reviews.
 * @param {Object} props.order - The order data containing customer and shipping info.
 * @param {Object} props.order.shipping_address - The shipping address object used to determine reviewer name.
 * @returns {JSX.Element} A JSX element containing a button and a conditional review submission form.
 * @description
 *   - Handles state management for review form inputs including rating, title, and review text.
 *   - Utilizes GraphQL mutations and queries to interact with the backend for review submission and metadata fetching.
 *   - Allows media files to be uploaded and managed within the review using a custom file picker.
 *   - Provides feedback through a toast notification system upon successful or unsuccessful actions.
 */
const ReviewButton = ({ product, order }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [
    createAdvReview,
    { data: reviewData, loading: reviewLoading, error: reviewError },
  ] = useMutation(ADD_ADVANCED_REVIEW);
  const { data: customerReview } = useQuery(GET_CUSTOMER_REVIEW_TOKEN);
  const { data: ratingMapping } = useQuery(GET_REVIEW_RATiNGS_METADATA);
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = () => {
    if (hasReview) {
      router.push("/customer/dashboard/reviews");
    } else {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (customerReview) {
      const filteredReviews = customerReview.customer.reviews.items.filter(
        (review) => {
          return review.product.sku === product.product_sku;
        },
      );

      if (filteredReviews.length > 0) {
        setHasReview(true);
      }
    }
  }, [customerReview, product]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  /**
   * Processes and submits a product review.
   * @example
   * sync(); // Submits the review and shows a success toast.
   * @param {Object} ratingMapping - The object containing product review ratings metadata.
   * @param {number} rating - The rating value given by the user.
   * @param {Array} uploadedFiles - List of uploaded files including images and videos.
   * @param {Object} product - Contains product details including product ID.
   * @param {Object} order - Contains order details including shipping address.
   * @param {string} title - The title of the review.
   * @param {string} review - Detailed review text from the user.
   * @returns {void} No value is returned.
   * @description
   *   - Constructs the input object to be sent to the createAdvReview function.
   *   - Extracts and encodes image and video paths from uploaded files.
   *   - Displays a success toast upon successful review submission.sss
   */
  const handleSubmit = async () => {
    const ratingItem = ratingMapping?.productReviewRatingsMetadata?.items?.[0];
    const ratingValue = ratingItem?.values.find(
      (v) => Number(v.value) === rating,
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
      product_id: product.product.id,
      ratings,
      nickname: `${order.shipping_address.firstname} ${order.shipping_address.lastname}`,
      title,
      detail: review,
      tmp_images_path: tmp_images_path,
      tmp_video_path: tmp_video_path[0],
    };

    await createAdvReview({ variables: { input } });

    setShowPopup(false);
    toast({
      type: "success",
      description:
        "Thank you for your review! Your feedback has been submitted and is awaiting approval.",
    });
  };

  const onLoadFileError = (fileName) => {
    toast({
      type: "error",
      description: `Cant upload Additional Documents file${fileName ? ". File: " + fileName : ""}`,
    });
  };

  const { openFilePicker: openFilePicker1 } = useFilePicker({
    multiple: true,
    accept: [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov", ".avi", ".webm"],
    onFilesSelected: ({ plainFiles, errors }) => {
      setSubmitDisable(true);
      if (errors) onLoadFileError();
      else {
        loadFiles(plainFiles, uploadedFiles, (files) => {
          setUploadedFiles([...files]);
        });
      }
    },
  });

  /**
   * Handles file uploading and ensures no duplicate files are uploaded.
   * @example
   * handleFilesUpload(files, currentFiles, callback)
   * // Processes each file and triggers callback with the updated files list
   * @param {Array} files - Array of files that need to be uploaded.
   * @param {Array} currentFiles - Array of already uploaded files to check for duplicates.
   * @param {Function} callback - Function to execute after processing all files.
   * @returns {void} No direct return value, executes a callback function.
   * @description
   *   - Utilizes environment configuration to determine the upload endpoint.
   *   - Prevents duplicate uploads by checking file names against existing uploads.
   *   - Uses FormData to append file data for POST requests.
   *   - Handles asynchronous operations with Promises and async/await syntax.
   */
  const loadFiles = (files, currentFiles, callback = () => {}) => {
    const _url = process.env.NEXT_PUBLIC_BACKEND_URL + "/rest/V1/review/upload";

    /**
     * Uploads a file to a server via a POST request and handles the response.
     * @example
     * sync(file)
     * { success: true }
     * @param {File} file - The file to be uploaded.
     * @returns {Promise<Object>} A promise that resolves to the response JSON object.
     * @description
     *   - The function uses FormData to format the file for upload.
     *   - It handles network errors and non-200 response codes by calling the onLoadFileError function.
     *   - The asynchronous function re-enables a submit button once the upload process is complete, regardless of success.
     */
    const _loadFile = async (file) => {
      const formData = new FormData();

      formData.append("file", file);

      try {
        const response = await fetch(_url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          onLoadFileError(file.name);
        }

        setSubmitDisable(false);

        return await response.json();
      } catch (error) {
        onLoadFileError(file.name);
      }
    };

    const _updatedFiles = currentFiles;

    files.forEach((file, index) => {
      if (
        currentFiles.find((_file) =>
          _file.name.split(".")[0].includes(file.name.split(".")[0]),
        )
      ) {
        toast({
          type: "alert",
          description: `File ${file.name} is already loaded.`,
        });

        if (index === files.length - 1) {
          callback(_updatedFiles);
        }

        return;
      }

      _loadFile(file).then((data) => {
        currentFiles.push({
          name: data[0],
          url: data[1],
          type: data[2],
        });

        if (index === files.length - 1) {
          callback(currentFiles);
        }
      });
    });
  };

  const removeUploadedFiles = (file) => {
    setUploadedFiles(uploadedFiles.filter((_file) => _file.name !== file.name));
  };

  return (
    <div>
      <button
        className={hasReview ? "text-green-500" : "text-[#00C0F3]"}
        onClick={handleClick}
      >
        {hasReview ? "View Review" : "Add Review"}
      </button>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[600px] relative">
            <button
              className="absolute top-6 right-6 underline text-gray-500"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Submit Your Review
            </h2>

            <div className="mb-2 flex items-center space-x-2">
              <label className="font-medium">Your Rating</label>
              <Rating
                className="z-10"
                ratedColor="#00C0F3"
                unratedColor="#00C0F3"
                value={rating}
                onChange={handleRatingChange}
              />
            </div>

            <input
              className="w-full p-2 border rounded mb-2 focus:outline-none"
              placeholder="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full p-2 border rounded mb-2 focus:outline-none"
              placeholder="Feedback..."
              rows="4"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div className="flex items-center border rounded overflow-hidden w-full">
              <button
                className={`border border-[#00C0F3] bg-[#00C0F3] text-white px-4 py-2`}
                type="button"
                onClick={() => openFilePicker1()}
              >
                UPLOAD MEDIA
              </button>
              <div className="flex gap-4 text-base text-primary">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`submissionIllustration-${index}`}
                    className="flex gap-1.5 items-center"
                  >
                    {file.name}
                    <button
                      className="text-[12px]"
                      onClick={() => removeUploadedFiles(file)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="mt-[15px] w-full bg-[#00C0F3] text-white p-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={submitDisable}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewButton;
