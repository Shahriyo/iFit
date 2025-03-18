import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/StatCard";
import ProgressCharts from "@/components/ProgressCharts";
import Goals from "@/components/Goals";
import { Timer, Dumbbell } from "lucide-react";
import { getTotalDuration } from "@/lib/utils";
import { Workout } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Progress() {
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  const totalWorkouts = workouts?.length || 0;
  const totalTime = getTotalDuration(workouts || []);

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard 
          icon={Timer}
          label="Total Time"
          value={`${totalTime} min`}
        />
        
        <StatCard 
          icon={Dumbbell}
          label="Workouts"
          value={totalWorkouts}
        />
      </div>
      
      <ProgressCharts />
      
      <Goals />
    </div>
  );
}
