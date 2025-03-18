import { useState, useEffect } from "react";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import TimerSettings from "@/components/TimerSettings";
import Toast from "@/components/Toast";
import useTimer from "@/hooks/useTimer";
import { useQuery } from "@tanstack/react-query";

export default function Timer() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [timerSettings, setTimerSettings] = useState({
    intervalDuration: 120, // 2 minutes in seconds
    intervalCount: 4,
    soundEnabled: true
  });

  // Fetch the timer settings
  const { data: settings } = useQuery({
    queryKey: ['/api/timer-settings'],
  });

  useEffect(() => {
    if (settings) {
      setTimerSettings({
        intervalDuration: settings.intervalDuration,
        intervalCount: settings.intervalCount,
        soundEnabled: settings.soundEnabled
      });
    }
  }, [settings]);

  const handleIntervalComplete = (interval: number) => {
    showToast(`Interval ${interval} complete! Starting next interval.`);
    playSound();
  };

  const handleWorkoutComplete = () => {
    showToast('Workout complete!');
    playSound();
  };

  const timer = useTimer({
    initialTime: timerSettings.intervalDuration,
    totalIntervals: timerSettings.intervalCount,
    onIntervalComplete: handleIntervalComplete,
    onWorkoutComplete: handleWorkoutComplete
  });

  const handleSettingsChange = (newSettings: { 
    intervalDuration: number; 
    intervalCount: number; 
    soundEnabled: boolean;
  }) => {
    setTimerSettings(newSettings);
    timer.setTime(newSettings.intervalDuration);
    timer.setIntervals(newSettings.intervalCount);
  };

  const showToast = (message: string) => {
    setNotificationText(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const playSound = () => {
    if (timerSettings.soundEnabled) {
      try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
      } catch (e) {
        console.log('Audio playback not supported');
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <TimerDisplay 
        currentTime={timer.currentTime}
        totalTime={timer.totalTime}
        currentInterval={timer.currentInterval}
        totalIntervals={timer.totalIntervals}
      />
      
      <TimerControls 
        isRunning={timer.isRunning}
        onStart={timer.startTimer}
        onPause={timer.pauseTimer}
        onReset={timer.resetTimer}
      />
      
      <TimerSettings onSettingsChange={handleSettingsChange} />
      
      <Toast 
        message={notificationText}
        visible={showNotification}
      />
    </div>
  );
}
