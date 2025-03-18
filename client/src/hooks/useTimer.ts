import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialTime: number;
  totalIntervals: number;
  onIntervalComplete?: (interval: number) => void;
  onWorkoutComplete?: () => void;
}

interface UseTimerReturn {
  currentTime: number;
  totalTime: number;
  currentInterval: number;
  totalIntervals: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTime: (time: number) => void;
  setIntervals: (intervals: number) => void;
}

export default function useTimer({
  initialTime,
  totalIntervals,
  onIntervalComplete,
  onWorkoutComplete
}: UseTimerProps): UseTimerReturn {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTime = initialTime;

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset timer when initialTime changes
  useEffect(() => {
    setCurrentTime(initialTime);
  }, [initialTime]);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setCurrentTime(prevTime => {
        if (prevTime <= 1) {
          // Interval complete
          if (currentInterval < totalIntervals) {
            // Move to next interval
            setCurrentInterval(prev => {
              const nextInterval = prev + 1;
              if (onIntervalComplete) {
                onIntervalComplete(prev);
              }
              return nextInterval;
            });
            return initialTime;
          } else {
            // All intervals complete
            clearInterval(timerRef.current!);
            setIsRunning(false);
            if (onWorkoutComplete) {
              onWorkoutComplete();
            }
            return 0;
          }
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [isRunning, currentInterval, totalIntervals, initialTime, onIntervalComplete, onWorkoutComplete]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setCurrentTime(initialTime);
    setCurrentInterval(1);
  }, [initialTime]);

  const setTime = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const setIntervals = useCallback((intervals: number) => {
    setCurrentInterval(prev => Math.min(prev, intervals));
  }, []);

  return {
    currentTime,
    totalTime,
    currentInterval,
    totalIntervals,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setTime,
    setIntervals
  };
}
