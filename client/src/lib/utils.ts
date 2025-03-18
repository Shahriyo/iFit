import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateCaloriesBurned(duration: number, intensity: number): number {
  // Simple calculation for estimated calories burned based on duration and intensity
  // This is just a rough estimate - a real calculation would be more sophisticated
  const baseRate = 5; // Base rate of calories burned per minute for moderate exercise
  const intensityFactor = intensity / 5; // Normalize intensity to a multiplier
  
  return Math.round(duration * baseRate * intensityFactor);
}

export function getTotalDuration(workouts: any[]): number {
  return workouts?.reduce((total, workout) => total + workout.duration, 0) || 0;
}

export function groupWorkoutsByWeek(workouts: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  
  workouts?.forEach(workout => {
    const date = new Date(workout.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }
    
    grouped[weekKey].push(workout);
  });
  
  return grouped;
}

function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for week starting on Monday
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}
