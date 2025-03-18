import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";

interface TimerDisplayProps {
  currentTime: number;
  totalTime: number;
  currentInterval: number;
  totalIntervals: number;
}

export default function TimerDisplay({
  currentTime,
  totalTime,
  currentInterval,
  totalIntervals
}: TimerDisplayProps) {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const circumference = 2 * Math.PI * 45;
    const timePercent = currentTime / totalTime;
    const calculatedOffset = circumference * (1 - timePercent);
    setOffset(calculatedOffset);
  }, [currentTime, totalTime]);

  return (
    <div className="relative w-64 h-64 my-6 flex items-center justify-center">
      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="5" />
        
        {/* Progress circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="#F97316" 
          strokeWidth="5" 
          strokeDasharray="283" 
          strokeDashoffset={offset}
          className="timer-progress"
          style={{
            transition: "stroke-dashoffset 1s linear",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%"
          }}
        />
      </svg>
      
      {/* Timer numbers */}
      <div className="text-center">
        <div className="text-5xl font-bold">{formatTime(currentTime)}</div>
        <div className="text-sm text-gray-500 mt-1">Interval {currentInterval}/{totalIntervals}</div>
      </div>
    </div>
  );
}
