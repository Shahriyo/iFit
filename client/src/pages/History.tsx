import { useQuery } from "@tanstack/react-query";
import WorkoutCard from "@/components/WorkoutCard";
import { Workout } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Workout History</h2>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workout History</h2>
      
      <div className="space-y-4">
        {workouts && workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No workouts recorded yet. Start logging your fitness activities!
          </div>
        )}
      </div>
    </div>
  );
}
