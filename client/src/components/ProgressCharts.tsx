import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Workout } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressCharts() {
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Weekly Activity</h3>
        <Skeleton className="h-48 w-full" />
      </Card>
    );
  }

  // Prepare weekly data
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today
  });

  // Create a map of workouts by day
  const workoutsByDay = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayWorkouts = workouts?.filter(workout => {
      const workoutDate = new Date(workout.date);
      return format(workoutDate, 'yyyy-MM-dd') === dayStr;
    }) || [];
    
    // Calculate total duration for this day
    const totalDuration = dayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

    return {
      day: format(day, 'EEE'), // e.g. Mon, Tue, etc.
      minutes: totalDuration,
      date: dayStr
    };
  });

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">Weekly Activity</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workoutsByDay}>
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
            />
            <Tooltip 
              formatter={(value) => [`${value} mins`, 'Duration']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar 
              dataKey="minutes"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
