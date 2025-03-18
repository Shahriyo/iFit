import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertGoalSchema } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Goal form schema
const goalFormSchema = insertGoalSchema.extend({
  title: z.string().min(3, {
    message: "Goal title must be at least 3 characters.",
  }),
  target: z.coerce.number().min(1, {
    message: "Target must be at least 1.",
  }),
  type: z.string({
    required_error: "Please select a goal type.",
  }),
});

// Remove userId as it will be added on the server
type GoalFormValues = Omit<z.infer<typeof goalFormSchema>, "userId">;

export default function Goals() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['/api/goals'],
  });

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema.omit({ userId: true })),
    defaultValues: {
      title: "",
      target: 1,
      type: "workout_count",
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormValues) => {
      return apiRequest('POST', '/api/goals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: "Goal created",
        description: "Your goal has been successfully added.",
      });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Failed to create goal",
        description: "There was an error creating your goal.",
        variant: "destructive",
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: "Goal deleted",
        description: "Your goal has been successfully removed.",
      });
    }
  });

  function onSubmit(values: GoalFormValues) {
    createGoalMutation.mutate(values);
  }

  function getGoalTypeLabel(type: string) {
    switch (type) {
      case 'workout_count':
        return 'workouts';
      case 'weekly_frequency':
        return 'this week';
      default:
        return '';
    }
  }

  function getProgressPercentage(current: number, target: number) {
    return Math.min(Math.round((current / target) * 100), 100);
  }

  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Goals</h3>
          <Button variant="ghost" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Goals</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new fitness goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Complete 20 workouts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="workout_count">Workout Count</SelectItem>
                          <SelectItem value="weekly_frequency">Weekly Frequency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Value</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={createGoalMutation.isPending}>
                    Create Goal
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <div className="text-sm text-gray-500">
                    {goal.current} / {goal.target} {getGoalTypeLabel(goal.type)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4 text-secondary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Could add an edit action here */}
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => deleteGoalMutation.mutate(goal.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Progress 
                value={getProgressPercentage(goal.current, goal.target)} 
                className="h-2.5 mt-2" 
              />
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No goals set yet. Create your first goal!
          </div>
        )}
      </div>
    </Card>
  );
}
