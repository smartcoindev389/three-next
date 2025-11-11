import { ITime } from "interfaces/global";

export const timeWithSeparator = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Partial<ITime>): string => {
  const getNum = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const time = `${getNum(hours)}:${getNum(minutes)}:${getNum(seconds)}`;

  return time;
};
