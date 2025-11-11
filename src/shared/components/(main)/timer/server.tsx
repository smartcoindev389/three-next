import ClientTimer from "./client";
import { calculateTimeLeft } from "./utils";

interface ServerTimerProps {
  endDate: string;
  onComplete?: () => void;
}

const ServerTimer: React.FC<ServerTimerProps> = ({ endDate, onComplete }) => {
  // Вычисляем время на сервере
  const initialTimeLeft = calculateTimeLeft(endDate);

  return (
    <ClientTimer
      endDate={endDate}
      initialTimeLeft={initialTimeLeft}
      onComplete={onComplete}
    />
  );
};

export default ServerTimer;
