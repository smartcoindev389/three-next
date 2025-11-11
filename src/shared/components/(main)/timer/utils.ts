export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const parseEndDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split("-");
  const [day, month, year] = datePart.split(".").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

export const calculateTimeLeft = (
  endDate: string,
  currentTime?: Date,
): TimeLeft => {
  const now = currentTime ? currentTime.getTime() : new Date().getTime();
  const end = parseEndDate(endDate).getTime();
  const difference = end - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export const formatTime = (time: TimeLeft) => ({
  days: time.days.toString().padStart(2, "0"),
  hours: time.hours.toString().padStart(2, "0"),
  minutes: time.minutes.toString().padStart(2, "0"),
  seconds: time.seconds.toString().padStart(2, "0"),
});
