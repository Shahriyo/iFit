import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialTime: number;
  totalIntervals: number;
  countDirection?: 'up' | 'down';
  onIntervalComplete?: (interval: number) => void;
  onWorkoutComplete?: () => void;
}

interface UseTimerReturn {
  currentTime: number;
  totalTime: number;
  currentInterval: number;
  totalIntervals: number;
  isRunning: boolean;
  countDirection: 'up' | 'down';
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTime: (time: number) => void;
  setIntervals: (intervals: number) => void;
}

export default function useTimer({
  initialTime,
  totalIntervals,
  countDirection = 'down',
  onIntervalComplete,
  onWorkoutComplete
}: UseTimerProps): UseTimerReturn {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(1);
  const totalTime = initialTime;
  
  // Store current timer state in ref to avoid stale closures in setInterval
  const stateRef = useRef({
    isRunning,
    currentTime,
    currentInterval,
    initialTime,
    totalIntervals,
    countDirection
  });
  
  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      isRunning,
      currentTime,
      currentInterval,
      initialTime,
      totalIntervals,
      countDirection
    };
  }, [isRunning, currentTime, currentInterval, initialTime, totalIntervals, countDirection]);
  
  // Timer interval ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Primary timer effect
  useEffect(() => {
    // Clear timer on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Effect to handle timer logic when running state changes
  useEffect(() => {
    if (isRunning) {
      // Start timer
      intervalRef.current = setInterval(() => {
        const state = stateRef.current;
        
        if (state.countDirection === 'down') {
          // Decrement time
          if (state.currentTime > 0) {
            setCurrentTime(time => time - 1);
          } else {
            // Handle interval completion
            if (state.currentInterval < state.totalIntervals) {
              if (onIntervalComplete) {
                onIntervalComplete(state.currentInterval);
              }
              setCurrentInterval(interval => interval + 1);
              setCurrentTime(state.initialTime);
            } else {
              // Workout complete
              if (onWorkoutComplete) {
                onWorkoutComplete();
              }
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              setIsRunning(false);
            }
          }
        } else {
          // Count up logic
          if (state.currentTime < state.initialTime) {
            setCurrentTime(time => time + 1);
          } else {
            // Handle interval completion
            if (state.currentInterval < state.totalIntervals) {
              if (onIntervalComplete) {
                onIntervalComplete(state.currentInterval);
              }
              setCurrentInterval(interval => interval + 1);
              setCurrentTime(0);
            } else {
              // Workout complete
              if (onWorkoutComplete) {
                onWorkoutComplete();
              }
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              setIsRunning(false);
            }
          }
        }
      }, 1000);
    } else {
      // Stop timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onIntervalComplete, onWorkoutComplete]);
  
  // Reset timer when initialTime changes
  useEffect(() => {
    if (!isRunning) {
      setCurrentTime(countDirection === 'down' ? initialTime : 0);
    }
  }, [initialTime, countDirection, isRunning]);

  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentTime(countDirection === 'down' ? initialTime : 0);
    setCurrentInterval(1);
  }, [initialTime, countDirection]);

  const setTime = useCallback((time: number) => {
    if (!isRunning) {
      setCurrentTime(countDirection === 'down' ? time : 0);
    }
  }, [countDirection, isRunning]);

  const setIntervals = useCallback((intervals: number) => {
    if (!isRunning) {
      setCurrentInterval(prev => Math.min(prev, intervals));
    }
  }, [isRunning]);

  return {
    currentTime,
    totalTime,
    currentInterval,
    totalIntervals,
    isRunning,
    countDirection,
    startTimer,
    pauseTimer,
    resetTimer,
    setTime,
    setIntervals
  };
}
