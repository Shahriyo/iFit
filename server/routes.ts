import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWorkoutSchema, 
  insertGoalSchema, 
  insertTimerSettingsSchema 
} from "@shared/schema";
import { z, ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User ID placeholder - in a real app, this would come from authentication
  const PLACEHOLDER_USER_ID = 1;
  
  // Create a default user if it doesn't exist
  const existingUser = await storage.getUserByUsername("demo");
  if (!existingUser) {
    await storage.createUser({
      username: "demo",
      password: "password"
    });
  }

  // Get all workouts
  app.get("/api/workouts", async (req: Request, res: Response) => {
    try {
      const workouts = await storage.getWorkouts(PLACEHOLDER_USER_ID);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve workouts" });
    }
  });

  // Get workout by ID
  app.get("/api/workouts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const workout = await storage.getWorkout(id);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve workout" });
    }
  });

  // Create workout
  app.post("/api/workouts", async (req: Request, res: Response) => {
    try {
      const workoutData = insertWorkoutSchema.parse({
        ...req.body,
        userId: PLACEHOLDER_USER_ID
      });
      
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: (error as z.ZodError).errors });
      }
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  // Update workout
  app.patch("/api/workouts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingWorkout = await storage.getWorkout(id);
      
      if (!existingWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      if (existingWorkout.userId !== PLACEHOLDER_USER_ID) {
        return res.status(403).json({ message: "Not authorized to update this workout" });
      }
      
      const validatedData = insertWorkoutSchema.partial().parse(req.body);
      const workout = await storage.updateWorkout(id, validatedData);
      res.json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: (error as z.ZodError).errors });
      }
      res.status(500).json({ message: "Failed to update workout" });
    }
  });

  // Delete workout
  app.delete("/api/workouts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const workout = await storage.getWorkout(id);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      if (workout.userId !== PLACEHOLDER_USER_ID) {
        return res.status(403).json({ message: "Not authorized to delete this workout" });
      }
      
      await storage.deleteWorkout(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  // Get all goals
  app.get("/api/goals", async (req: Request, res: Response) => {
    try {
      const goals = await storage.getGoals(PLACEHOLDER_USER_ID);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve goals" });
    }
  });

  // Create goal
  app.post("/api/goals", async (req: Request, res: Response) => {
    try {
      const goalData = insertGoalSchema.parse({
        ...req.body,
        userId: PLACEHOLDER_USER_ID
      });
      
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: (error as z.ZodError).errors });
      }
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  // Update goal
  app.patch("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getGoal(id);
      
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      if (goal.userId !== PLACEHOLDER_USER_ID) {
        return res.status(403).json({ message: "Not authorized to update this goal" });
      }
      
      const updatedGoal = await storage.updateGoal(id, req.body);
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  // Delete goal
  app.delete("/api/goals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getGoal(id);
      
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      if (goal.userId !== PLACEHOLDER_USER_ID) {
        return res.status(403).json({ message: "Not authorized to delete this goal" });
      }
      
      await storage.deleteGoal(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Get timer settings
  app.get("/api/timer-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getTimerSettings(PLACEHOLDER_USER_ID);
      
      if (!settings) {
        // Return default settings if none exist
        return res.json({
          userId: PLACEHOLDER_USER_ID,
          intervalDuration: 120, // 2 minutes in seconds
          intervalCount: 4,
          soundEnabled: true
        });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve timer settings" });
    }
  });

  // Update timer settings
  app.post("/api/timer-settings", async (req: Request, res: Response) => {
    try {
      const settingsData = insertTimerSettingsSchema.parse({
        ...req.body,
        userId: PLACEHOLDER_USER_ID
      });
      
      const settings = await storage.createOrUpdateTimerSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: (error as z.ZodError).errors });
      }
      res.status(500).json({ message: "Failed to update timer settings" });
    }
  });

  // Setup HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
