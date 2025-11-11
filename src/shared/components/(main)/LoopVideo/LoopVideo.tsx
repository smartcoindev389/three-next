import { FC, useRef, useEffect } from "react";

interface ILoopVideo {
  srcMp4: string;
  srcWebm: string;
  className?: string;
}

export const LoopVideo: FC<ILoopVideo> = ({ srcMp4, srcWebm, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      const loopStart = videoElement.duration - 1;
      const loopEnd = videoElement.duration;
      if (videoElement.currentTime >= loopEnd - 0.1) {
        videoElement.currentTime = loopStart;
        videoElement.play();
      }
    };
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <video
      className={className}
      ref={videoRef}
      muted
      autoPlay
      playsInline
      loop={false}
    >
      {srcMp4 && <source src={srcMp4} type="video/mp4" />}
      {srcWebm && <source src={srcWebm} type="video/webm" />}
    </video>
  );
};
