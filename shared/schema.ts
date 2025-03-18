import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Workout schema
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  exerciseType: text("exercise_type").notNull(),
  exerciseName: text("exercise_name").notNull(),
  duration: integer("duration").notNull(),
  intensity: integer("intensity").notNull(),
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  date: true,
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;

// Goal schema
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  target: integer("target").notNull(),
  current: integer("current").notNull().default(0),
  type: text("type").notNull(), // 'workout_count', 'weekly_frequency', etc.
  completed: boolean("completed").notNull().default(false),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  completed: true,
  current: true,
  date: true,
});

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

// Timer settings schema
export const timerSettings = pgTable("timer_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  intervalDuration: integer("interval_duration").notNull().default(120), // in seconds
  intervalCount: integer("interval_count").notNull().default(4),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  countDirection: text("count_direction").notNull().default("down"), // "up" or "down"
});

export const insertTimerSettingsSchema = createInsertSchema(timerSettings).omit({
  id: true,
});

export type InsertTimerSettings = z.infer<typeof insertTimerSettingsSchema>;
export type TimerSettings = typeof timerSettings.$inferSelect;
