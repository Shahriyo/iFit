import { Card, CardContent } from "@/components/ui/card";
import { Workout } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Timer, Zap } from "lucide-react";

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const formatDate = (date: Date | string) => {
    const workoutDate = new Date(date);
    return workoutDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Capitalize exercise type
  const formatExerciseType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-4">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{formatExerciseType(workout.exerciseType)}</h3>
          <span className="text-sm text-gray-500">{formatDate(workout.date)}</span>
        </div>
        <div className="text-gray-600 mb-2">{workout.exerciseName}</div>
        <div className="flex space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Timer className="h-4 w-4 mr-1" />
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            <span>Intensity: {workout.intensity}/10</span>
          </div>
        </div>
        {workout.notes && (
          <p className="text-sm text-gray-600">{workout.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
