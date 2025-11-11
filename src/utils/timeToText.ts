import { ITime } from "interfaces/global";

export const timeToText = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Partial<ITime>) => {
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    formattedTime += `${minutes}m `;
  }
  formattedTime += `${seconds}s`;

  return formattedTime;
};
