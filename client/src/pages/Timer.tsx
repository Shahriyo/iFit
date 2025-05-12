import { useState, useEffect, useMemo } from "react";
import { formatTime } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Timer() {
  const [durationMinutes, setDurationMinutes] = useState(2); // Default to 2 minutes
  const [time, setTime] = useState(durationMinutes * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [exerciseType, setExerciseType] = useState("cardio"); // Default exercise type
  const [elapsedTime, setElapsedTime] = useState(0); // Track total elapsed time
  const [totalIntervals, setTotalIntervals] = useState(4); // Total number of intervals
  
  // Update time when duration changes
  useEffect(() => {
    setTime(durationMinutes * 60);
  }, [durationMinutes]);
  
  // Initial time for the current duration
  const initialTime = durationMinutes * 60;
  
  // Calculate progress for the circle animation
  const progress = useMemo(() => {
    return (initialTime - time) / initialTime;
  }, [time, initialTime]);
  
  // SVG circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  // Simple useEffect to handle the timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Time is up for this interval
            if (currentInterval < totalIntervals) {
              // Move to next interval
              setCurrentInterval(prev => prev + 1);
              return initialTime; // Reset timer for next interval
            } else {
              // All intervals are complete
              clearInterval(interval);
              setIsRunning(false);
              return 0;
            }
          }
          return prevTime - 1;
        });
        
        // Increment elapsed time when timer is running
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentInterval, totalIntervals, initialTime]);
  
  // Handle duration change
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = Number(e.target.value);
    setDurationMinutes(newDuration);
    
    // Reset timer state when duration changes
    if (isRunning) {
      setIsRunning(false);
    }
    setCurrentInterval(1);
  };
  
  // Handle intervals change
  const handleIntervalsChange = (value: string) => {
    const newIntervals = Number(value);
    setTotalIntervals(newIntervals);
    
    // Reset timer state when interval count changes
    if (isRunning) {
      setIsRunning(false);
    }
    setCurrentInterval(1);
  };
  
  // Start, pause, and reset functions
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(initialTime); // Reset to initial time
    setCurrentInterval(1); // Reset to first interval
    setElapsedTime(0); // Reset elapsed time
  };
  
  // Format the time for display as MM:SS
  const displayTime = formatTime(time);
  
  // Calculate total workout time across all intervals
  const totalWorkoutTime = initialTime * totalIntervals;
  const formattedTotalTime = formatTime(totalWorkoutTime);
  
  // Format elapsed time
  const formattedElapsedTime = formatTime(elapsedTime);
  
  // Calculate remaining time
  const remainingTime = totalWorkoutTime - elapsedTime;
  const formattedRemainingTime = formatTime(remainingTime > 0 ? remainingTime : 0);
  
  // Generate options for duration dropdown (1-60 minutes)
  const durationOptions = Array.from({ length: 60 }, (_, i) => i + 1);
  
  // Generate options for interval dropdown (1-20 sets)
  const intervalOptions = Array.from({ length: 20 }, (_, i) => i + 1);
  
  return (
    <div className="flex flex-col items-center p-8">
      
      {/* Exercise Type Selection */}
      <div className="mb-6 w-full max-w-md">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Exercise Type
          </label>
          <Select onValueChange={setExerciseType} value={exerciseType} disabled={isRunning}>
            <SelectTrigger>
              <SelectValue placeholder="Select exercise type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="strength">Strength Training</SelectItem>
              <SelectItem value="hiit">HIIT</SelectItem>
              <SelectItem value="yoga">Yoga</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Timer Settings */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div>
          <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-700">
            Interval Duration
          </label>
          <select
            id="duration"
            value={durationMinutes}
            onChange={handleDurationChange}
            disabled={isRunning}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {durationOptions.map(min => (
              <option key={min} value={min}>
                {min} {min === 1 ? 'minute' : 'minutes'}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Number of Sets
          </label>
          <Select 
            onValueChange={handleIntervalsChange} 
            value={totalIntervals.toString()}
            disabled={isRunning}
          >
            <SelectTrigger className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 h-[42px]">
              <SelectValue placeholder="Select sets" />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map(interval => (
                <SelectItem key={interval} value={interval.toString()}>
                  {interval} {interval === 1 ? 'set' : 'sets'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Timer Display with Progress Circle */}
      <div className="relative w-64 h-64 my-6 flex items-center justify-center">
        <svg className="w-full h-full absolute" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#e6e6e6" 
            strokeWidth="5"
          />
          
          {/* Progress circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#1C1C1C" 
            strokeWidth="5" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            className="timer-progress"
            style={{
              transition: "stroke-dashoffset 0.5s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%"
            }}
          />
        </svg>
        
        {/* Timer numbers */}
        <div className="text-center z-10">
          <div className="text-6xl font-mono font-bold" data-testid="timer-display">
            {displayTime}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Set {currentInterval}/{totalIntervals}
          </div>
        </div>
      </div>
      
      {/* Timer Controls */}
      <div className="flex space-x-4">
        <button
          className="bg-gray-900 text-white px-6 py-2 rounded-full disabled:bg-gray-300"
          onClick={startTimer}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="bg-gray-900 text-white px-6 py-2 rounded-full disabled:bg-gray-300"
          onClick={pauseTimer}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          className="bg-gray-900 text-white px-6 py-2 rounded-full"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      
      {/* Workout Time Stats */}
      <div className="mt-6 text-center w-full max-w-md">
        <div className="grid grid-cols-3 gap-4 border rounded-lg p-4 bg-gray-50">
          <div>
            <p className="text-xs text-gray-600">Elapsed Time</p>
            <p className="text-lg font-semibold text-green-600">{formattedElapsedTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Remaining</p>
            <p className="text-lg font-semibold text-orange-600">{formattedRemainingTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Time</p>
            <p className="text-lg font-semibold">{formattedTotalTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
