import { ITime } from "interfaces/global";

export function secondsToTime(fullSeconds?: number): ITime {
  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (fullSeconds) {
    hours = Math.floor(fullSeconds / 3600);
    minutes = Math.floor((fullSeconds % 3600) / 60);
    seconds = Math.round(fullSeconds % 60);
  }

  return { hours, minutes, seconds };
}
