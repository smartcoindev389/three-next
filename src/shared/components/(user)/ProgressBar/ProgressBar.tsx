import { FC } from "react";

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ percent }) => {
  return (
    <div className="w-full h-3 bg-[#83CDAA80] rounded-full">
      <div
        className="bg-[#83CDAA] h-3 rounded-full flex justify-between transition-[width] duration-1000"
        style={{ width: `${percent}%` }}
      >
        <div className="bg-[#5CC193] h-3 w-3 rounded-full" />
        <div className="bg-[#5CC193] h-3 w-3 rounded-full" />
      </div>
    </div>
  );
};

export default ProgressBar;
