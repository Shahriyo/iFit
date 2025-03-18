import { 
  users, type User, type InsertUser,
  workouts, type Workout, type InsertWorkout,
  goals, type Goal, type InsertGoal,
  timerSettings, type TimerSettings, type InsertTimerSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Workout methods
  getWorkouts(userId: number): Promise<Workout[]>;
  getWorkout(id: number): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;

  // Goals methods
  getGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // Timer settings methods
  getTimerSettings(userId: number): Promise<TimerSettings | undefined>;
  createOrUpdateTimerSettings(settings: InsertTimerSettings): Promise<TimerSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private goals: Map<number, Goal>;
  private timerSettings: Map<number, TimerSettings>;
  private currentUserId: number;
  private currentWorkoutId: number;
  private currentGoalId: number;
  private currentTimerSettingsId: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.goals = new Map();
    this.timerSettings = new Map();
    this.currentUserId = 1;
    this.currentWorkoutId = 1;
    this.currentGoalId = 1;
    this.currentTimerSettingsId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Workout methods
  async getWorkouts(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.userId === userId
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = this.currentWorkoutId++;
    const workout: Workout = { 
      ...insertWorkout, 
      id, 
      date: new Date(),
      notes: insertWorkout.notes ?? null // Ensure notes is never undefined
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const existingWorkout = this.workouts.get(id);
    if (!existingWorkout) return undefined;
    
    const updatedWorkout = { ...existingWorkout, ...workout };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // Goals methods
  async getGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.userId === userId
    );
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      ...insertGoal,
      id,
      date: new Date(),
      current: 0,
      completed: false
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, goalUpdate: Partial<Goal>): Promise<Goal | undefined> {
    const existingGoal = this.goals.get(id);
    if (!existingGoal) return undefined;
    
    const updatedGoal = { ...existingGoal, ...goalUpdate };
    
    // Check if goal is completed
    if (updatedGoal.current >= updatedGoal.target) {
      updatedGoal.completed = true;
    }
    
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Timer settings methods
  async getTimerSettings(userId: number): Promise<TimerSettings | undefined> {
    return Array.from(this.timerSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async createOrUpdateTimerSettings(settings: InsertTimerSettings): Promise<TimerSettings> {
    const existingSettings = await this.getTimerSettings(settings.userId);
    
    if (existingSettings) {
      const updatedSettings = { ...existingSettings, ...settings };
      this.timerSettings.set(existingSettings.id, updatedSettings);
      return updatedSettings;
    } else {
      const id = this.currentTimerSettingsId++;
      const newSettings: TimerSettings = { ...settings, id };
      this.timerSettings.set(id, newSettings);
      return newSettings;
    }
  }
}

export const storage = new MemStorage();
