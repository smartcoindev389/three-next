import { useState } from "react";
import { useFilePicker } from "use-file-picker";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import classNames from "classnames";

import CameraIcon from "@/assets/icons/camera.png";
import { useToast } from "@/shared/components/(common)/ui/use-toast";

const MediaUploader = ({ onChange }) => {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitDisable, setSubmitDisable] = useState(false);
  const { toast } = useToast();

  const onLoadFileError = (fileName) => {
    toast({
      type: "error",
      description: `Cant upload Additional Documents file${fileName ? ". File: " + fileName : ""}`,
    });
  };

  const { openFilePicker: openFilePicker } = useFilePicker({
    multiple: true,
    accept: [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov", ".avi", ".webm"],
    onFilesSelected: ({ plainFiles, errors }) => {
      setSubmitDisable(true);
      if (errors) onLoadFileError();
      else {
        loadFiles(plainFiles, uploadedFiles, (files) => {
          setUploadedFiles([...files]);
          onChange(files);
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
      const hasLoadedFiles = currentFiles.find((_file) =>
        _file.name.split(".")[0].includes(file.name.split(".")[0]),
      );

      if (hasLoadedFiles) {
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
    const files = uploadedFiles.filter((_file) => _file.name !== file.name);

    setUploadedFiles(files);
    onChange(files);
  };

  const handleClick = () => {
    openFilePicker();
  };

  return (
    <div className="relative w-full h-[92px] mb-[24px] border border-[#74788D] border-dashed bg-[#F5F5F5] rounded-[10px] pt-[30px] pr-[33px] pb-[30px] pl-[33px]">
      <button
        className="absolute inset-0 w-full h-full opacity-0 z-0"
        disabled={submitDisable}
        type="button"
        onClick={handleClick}
      >
        {t("Upload Media")}
      </button>
      <div
        className={classNames(
          "relative z-10 flex gap-1.5 items-center cursor-pointer",
          uploadedFiles.length === 0 && "justify-center",
        )}
        onClick={handleClick}
      >
        {uploadedFiles.length === 0 && (
          <div className="flex justify-center gap-[10px]">
            <Image alt="placeholder-image" src={CameraIcon} />
            <p className="self-center text-[#74788D] text-xl font-medium">
              Share a video or photo
            </p>
          </div>
        )}
        {uploadedFiles.map((file, index) => (
          <div
            key={`submissionIllustration-${index}`}
            className="flex gap-1.5 items-center"
          >
            {file.name}
            <button
              className="text-[12px]"
              onClick={(event) => {
                event.stopPropagation();
                removeUploadedFiles(file);
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;
