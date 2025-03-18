import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset
}: TimerControlsProps) {
  return (
    <div className="flex space-x-4 mt-4">
      <Button 
        variant={isRunning ? "outline" : "default"}
        onClick={onStart}
        className="px-6 py-3 rounded-full shadow-md flex items-center"
        disabled={isRunning}
      >
        <Play className="mr-1" size={18} />
        <span>Start</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={onPause}
        className="px-6 py-3 rounded-full shadow-md flex items-center"
        disabled={!isRunning}
      >
        <Pause className="mr-1" size={18} />
        <span>Pause</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={onReset}
        className="px-6 py-3 rounded-full shadow-md flex items-center"
      >
        <RefreshCw className="mr-1" size={18} />
        <span>Reset</span>
      </Button>
    </div>
  );
}
