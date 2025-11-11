"use client";

import { FC, useState, useEffect } from "react";
import { TimeLeft, calculateTimeLeft, formatTime } from "./utils";

interface ClientTimerProps {
  endDate: string;
  initialTimeLeft: TimeLeft;
  onComplete?: () => void;
}

const ClientTimer: FC<ClientTimerProps> = ({
  endDate,
  initialTimeLeft,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTimeLeft);

  useEffect(() => {
    // Сразу пересчитываем время на клиенте
    setTimeLeft(calculateTimeLeft(endDate));

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onComplete]);

  const html = formatTime(timeLeft);

  return (
    <div className="time">
      <div className="days">
        <b>{html.days}</b> <span>Days</span>
      </div>
      <div className="hours">
        <b>{html.hours}</b> <span>Hours</span>
      </div>
      <div className="minutes">
        <b>{html.minutes}</b> <span>Minutes</span>
      </div>
    </div>
  );
};

export default ClientTimer;
