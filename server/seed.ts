import { storage } from "./storage";
import { startOfWeek, addWeeks, subWeeks } from "date-fns";
import { generateAssignment } from "./scheduler";

async function seed() {
  console.log("Seeding database with initial assignments...");

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  // Generate assignments for last 4 weeks, current week, and next 2 weeks
  const weeks = [
    subWeeks(currentWeekStart, 4),
    subWeeks(currentWeekStart, 3),
    subWeeks(currentWeekStart, 2),
    subWeeks(currentWeekStart, 1),
    currentWeekStart,
    addWeeks(currentWeekStart, 1),
    addWeeks(currentWeekStart, 2),
  ];

  let previousAssignment = null;

  for (const weekStart of weeks) {
    // Check if assignment already exists
    const existing = await storage.getAssignmentByWeek(weekStart);
    if (existing) {
      console.log(`Assignment for week of ${weekStart.toISOString()} already exists`);
      previousAssignment = existing;
      continue;
    }

    // Generate new assignment
    const assignment = await generateAssignment(weekStart, previousAssignment || undefined);
    const created = await storage.createAssignment(assignment);
    console.log(`Created assignment for week of ${weekStart.toISOString()}`);
    previousAssignment = created;
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
