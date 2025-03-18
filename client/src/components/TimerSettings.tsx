import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface TimerSettingsProps {
  onSettingsChange: (settings: {
    intervalDuration: number;
    intervalCount: number;
    soundEnabled: boolean;
  }) => void;
}

export default function TimerSettings({ onSettingsChange }: TimerSettingsProps) {
  const [intervalDuration, setIntervalDuration] = useState(2);
  const [intervalCount, setIntervalCount] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();

  // Fetch settings from the server
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/timer-settings'],
  });

  // Update settings on the server
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
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
    if (settings) {
      setIntervalDuration(settings.intervalDuration / 60); // Convert from seconds to minutes
      setIntervalCount(settings.intervalCount);
      setSoundEnabled(settings.soundEnabled);
      
      // Notify parent component about the initial settings
      onSettingsChange({
        intervalDuration: settings.intervalDuration,
        intervalCount: settings.intervalCount,
        soundEnabled: settings.soundEnabled
      });
    }
  }, [settings, onSettingsChange]);

  // Update settings handler
  const handleSettingsChange = (field: string, value: number | boolean) => {
    let newSettings = { 
      intervalDuration: intervalDuration * 60, // Store in seconds
      intervalCount, 
      soundEnabled 
    };

    if (field === 'intervalDuration') {
      setIntervalDuration(value as number);
      newSettings.intervalDuration = (value as number) * 60; // Convert to seconds
    } else if (field === 'intervalCount') {
      setIntervalCount(value as number);
      newSettings.intervalCount = value as number;
    } else if (field === 'soundEnabled') {
      setSoundEnabled(value as boolean);
      newSettings.soundEnabled = value as boolean;
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
          <Input 
            type="number" 
            id="interval-duration"
            min={1} 
            max={60} 
            value={intervalDuration}
            onChange={(e) => handleSettingsChange('intervalDuration', parseInt(e.target.value) || 1)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="interval-count" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Intervals
          </Label>
          <Input 
            type="number" 
            id="interval-count"
            min={1} 
            max={20} 
            value={intervalCount}
            onChange={(e) => handleSettingsChange('intervalCount', parseInt(e.target.value) || 1)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
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
      </CardContent>
    </Card>
  );
}
