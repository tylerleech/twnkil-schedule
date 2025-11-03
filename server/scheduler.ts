import { type InsertAssignment, type Assignment, type Employee } from "@shared/schema";
import { storage } from "./storage";
import { startOfWeek, addWeeks, subWeeks } from "date-fns";

// All possible employee pairs for audits
const ALL_PAIRS: [Employee, Employee][] = [
  ["tyler", "claudia"],
  ["tyler", "nalleli"],
  ["tyler", "ana"],
  ["nalleli", "claudia"],
  ["nalleli", "ana"],
  ["claudia", "ana"],
];

// Balance check employees (Nalleli is excluded)
const BALANCE_CHECK_EMPLOYEES: Employee[] = ["tyler", "claudia", "ana"];

// All possible weekdays for audits (Mon-Fri = 1-5)
const ALL_DAYS = [1, 2, 3, 4, 5];

/**
 * Checks if two pairs are the same (order doesn't matter)
 */
function areSamePair(pair1: [string, string], pair2: [string, string]): boolean {
  return (
    (pair1[0] === pair2[0] && pair1[1] === pair2[1]) ||
    (pair1[0] === pair2[1] && pair1[1] === pair2[0])
  );
}

/**
 * Get available pairs that are different from the previous week's pair
 */
function getAvailablePairs(previousPair?: [string, string]): [Employee, Employee][] {
  if (!previousPair) return ALL_PAIRS;
  return ALL_PAIRS.filter(pair => !areSamePair(pair, previousPair));
}

/**
 * Get available days that are different from the previous week's day
 */
function getAvailableDays(previousDay?: number): number[] {
  if (!previousDay) return ALL_DAYS;
  return ALL_DAYS.filter(day => day !== previousDay);
}

/**
 * Get a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Generate a new assignment for a specific week with constraints
 */
export async function generateAssignment(
  weekStartDate: Date,
  previousAssignment?: Assignment
): Promise<InsertAssignment> {
  // Get available pairs (excluding previous week's pair)
  const previousPair = previousAssignment
    ? [previousAssignment.auditEmployee1, previousAssignment.auditEmployee2] as [string, string]
    : undefined;
  const availablePairs = getAvailablePairs(previousPair);
  const selectedPair = getRandomItem(availablePairs);

  // Get available days (excluding previous week's day)
  const availableDays = getAvailableDays(previousAssignment?.auditDay);
  const selectedDay = getRandomItem(availableDays);

  // Get random balance check employee
  const balanceCheckEmployee = getRandomItem(BALANCE_CHECK_EMPLOYEES);

  return {
    weekStartDate,
    auditEmployee1: selectedPair[0],
    auditEmployee2: selectedPair[1],
    auditDay: selectedDay,
    balanceCheckEmployee,
    notes: null,
  };
}

/**
 * Generate and save assignment for a specific week
 * Validates constraints before saving
 */
export async function createWeekAssignment(weekStartDate: Date): Promise<Assignment> {
  // Normalize to start of week (Monday)
  const normalizedDate = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  
  // Check if assignment already exists for this week
  const existing = await storage.getAssignmentByWeek(normalizedDate);
  if (existing) {
    throw new Error("Assignment already exists for this week");
  }

  // Get previous week's assignment for constraint checking
  const previousWeek = subWeeks(normalizedDate, 1);
  const previousAssignment = await storage.getAssignmentByWeek(previousWeek);

  // Generate the assignment
  const newAssignment = await generateAssignment(normalizedDate, previousAssignment);

  // Save to storage
  return await storage.createAssignment(newAssignment);
}

/**
 * Generate next week's assignment based on current week
 */
export async function generateNextWeek(): Promise<Assignment> {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nextWeekStart = addWeeks(currentWeekStart, 1);
  
  // Check if next week already exists
  const existing = await storage.getAssignmentByWeek(nextWeekStart);
  if (existing) {
    return existing;
  }

  // Get current week's assignment for constraints
  const currentAssignment = await storage.getAssignmentByWeek(currentWeekStart);
  
  // Generate the assignment
  const newAssignment = await generateAssignment(nextWeekStart, currentAssignment);
  
  // Save to storage
  return await storage.createAssignment(newAssignment);
}

/**
 * Validate that an assignment meets all constraints
 */
export async function validateAssignment(
  assignment: InsertAssignment
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Check that audit employees are different
  if (assignment.auditEmployee1 === assignment.auditEmployee2) {
    errors.push("Audit employees must be different");
  }

  // Check that audit day is valid (1-5)
  if (assignment.auditDay < 1 || assignment.auditDay > 5) {
    errors.push("Audit day must be between 1 and 5 (Monday-Friday)");
  }

  // Check that balance check employee is not Nalleli
  if (assignment.balanceCheckEmployee === "nalleli") {
    errors.push("Nalleli cannot be assigned to balance checks");
  }

  // Check constraints with previous week
  const previousWeek = subWeeks(assignment.weekStartDate, 1);
  const previousAssignment = await storage.getAssignmentByWeek(previousWeek);
  
  if (previousAssignment) {
    // Check that audit pair is different
    const currentPair = [assignment.auditEmployee1, assignment.auditEmployee2] as [string, string];
    const previousPair = [previousAssignment.auditEmployee1, previousAssignment.auditEmployee2] as [string, string];
    
    if (areSamePair(currentPair, previousPair)) {
      errors.push("Audit pair must be different from previous week");
    }

    // Check that audit day is different
    if (assignment.auditDay === previousAssignment.auditDay) {
      errors.push("Audit day must be different from previous week");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
