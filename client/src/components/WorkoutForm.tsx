import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertWorkoutSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

// Extend the schema with additional validation
const workoutFormSchema = insertWorkoutSchema.extend({
  exerciseName: z.string().min(2, {
    message: "Exercise name must be at least 2 characters.",
  }),
  duration: z.coerce.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
  intensity: z.coerce.number().min(1, {
    message: "Intensity must be at least 1.",
  }).max(10, {
    message: "Intensity cannot be more than 10.",
  }),
  notes: z.string().optional(),
});

// Remove userId as it will be added on the server
type WorkoutFormValues = Omit<z.infer<typeof workoutFormSchema>, "userId">;

export default function WorkoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema.omit({ userId: true })),
    defaultValues: {
      exerciseType: "cardio",
      exerciseName: "",
      duration: 30,
      intensity: 5,
      notes: "",
    },
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: WorkoutFormValues) => {
      return apiRequest('POST', '/api/workouts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      toast({
        title: "Workout saved",
        description: "Your workout has been successfully logged.",
      });
      form.reset({
        exerciseType: "cardio",
        exerciseName: "",
        duration: 30,
        intensity: 5,
        notes: "",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to save workout",
        description: "There was an error saving your workout.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  function onSubmit(values: WorkoutFormValues) {
    setIsSubmitting(true);
    createWorkoutMutation.mutate(values);
  }

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="exerciseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="exerciseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Running, Push-ups" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intensity (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How did it go?" 
                      className="resize-none" 
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Workout
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
