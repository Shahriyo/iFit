import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimerSettingsProps {
  onSettingsChange: (settings: {
    intervalDuration: number;
    intervalCount: number;
    soundEnabled: boolean;
    countDirection: 'up' | 'down';
  }) => void;
}

export default function TimerSettings({ onSettingsChange }: TimerSettingsProps) {
  const [intervalDuration, setIntervalDuration] = useState(120); // 2 minutes in seconds
  const [intervalCount, setIntervalCount] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [countDirection, setCountDirection] = useState<'up' | 'down'>('down');
  const { toast } = useToast();

  // Define the type for timer settings
  interface TimerSettingsData {
    userId: number;
    intervalDuration: number;
    intervalCount: number;
    soundEnabled: boolean;
    countDirection: 'up' | 'down';
    id?: number;
  }
  
  // Fetch settings from the server
  const { data: settings, isLoading } = useQuery<TimerSettingsData>({
    queryKey: ['/api/timer-settings'],
  });

  // Update settings on the server
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: TimerSettingsData) => {
      return apiRequest('POST', '/api/timer-settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timer-settings'] });
      toast({
        title: "Settings updated",
        description: "Your timer settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save settings",
        description: "There was an error saving your settings.",
        variant: "destructive",
      });
    }
  });

  // Initialize settings from the server
  useEffect(() => {
    if (settings && 
        'intervalDuration' in settings && 
        'intervalCount' in settings && 
        'soundEnabled' in settings) {
      
      setIntervalDuration(settings.intervalDuration);
      setIntervalCount(settings.intervalCount);
      setSoundEnabled(settings.soundEnabled);
      
      // Set count direction if available, otherwise use default
      if ('countDirection' in settings) {
        setCountDirection(settings.countDirection as 'up' | 'down');
      }
      
      // Notify parent component about the initial settings
      onSettingsChange({
        intervalDuration: settings.intervalDuration,
        intervalCount: settings.intervalCount,
        soundEnabled: settings.soundEnabled,
        countDirection: settings.countDirection || 'down'
      });
    }
  }, [settings, onSettingsChange]);

  // Update settings handler
  const handleSettingsChange = (field: string, value: number | boolean | string) => {
    let newSettings: TimerSettingsData = { 
      userId: 1, // Using placeholder user ID
      intervalDuration,
      intervalCount,
      soundEnabled,
      countDirection
    };

    if (field === 'intervalDuration') {
      setIntervalDuration(value as number);
    } else if (field === 'intervalCount') {
      setIntervalCount(value as number);
    } else if (field === 'soundEnabled') {
      setSoundEnabled(value as boolean);
    } else if (field === 'countDirection') {
      setCountDirection(value as 'up' | 'down');
    }

    // Notify parent component
    onSettingsChange(newSettings);

    // Save to server
    updateSettingsMutation.mutate(newSettings);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading settings...</div>;
  }

  return (
    <Card className="w-full max-w-md mt-8">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
        
        <div className="mb-4">
          <Label htmlFor="interval-duration" className="block text-sm font-medium text-gray-700 mb-1">
            Interval Duration (minutes)
          </Label>
          <Select 
            value={intervalDuration.toString()} 
            onValueChange={(value) => handleSettingsChange('intervalDuration', parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="180">3 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
              <SelectItem value="600">10 minutes</SelectItem>
              <SelectItem value="900">15 minutes</SelectItem>
              <SelectItem value="1200">20 minutes</SelectItem>
              <SelectItem value="1800">30 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="interval-count" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Intervals
          </Label>
          <Select 
            value={intervalCount.toString()} 
            onValueChange={(value) => handleSettingsChange('intervalCount', parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 interval</SelectItem>
              <SelectItem value="2">2 intervals</SelectItem>
              <SelectItem value="3">3 intervals</SelectItem>
              <SelectItem value="4">4 intervals</SelectItem>
              <SelectItem value="5">5 intervals</SelectItem>
              <SelectItem value="6">6 intervals</SelectItem>
              <SelectItem value="8">8 intervals</SelectItem>
              <SelectItem value="10">10 intervals</SelectItem>
              <SelectItem value="12">12 intervals</SelectItem>
              <SelectItem value="15">15 intervals</SelectItem>
              <SelectItem value="20">20 intervals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center mb-4">
          <Switch 
            id="sound-enabled"
            checked={soundEnabled}
            onCheckedChange={(checked) => handleSettingsChange('soundEnabled', checked)}
          />
          <Label htmlFor="sound-enabled" className="ml-2 block text-sm text-gray-700">
            Enable Sound Alerts
          </Label>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="count-direction" className="block text-sm font-medium text-gray-700 mb-1">
            Count Direction
          </Label>
          <Select 
            value={countDirection} 
            onValueChange={(value) => handleSettingsChange('countDirection', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select count direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="down">Count Down</SelectItem>
              <SelectItem value="up">Count Up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
