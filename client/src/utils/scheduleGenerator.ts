import { differenceInWeeks, startOfWeek } from "date-fns";

// Seeded random number generator for consistent results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get a random item from array using seeded random
function getRandomItem<T>(array: T[], seed: number): T {
  const index = Math.floor(seededRandom(seed) * array.length);
  return array[index];
}

// Get a random day (1-5) that's different from the previous day
function getRandomAuditDay(weekSeed: number, previousDay?: number): number {
  const allDays = [1, 2, 3, 4, 5]; // Mon-Fri
  
  // If we have a previous day, exclude it
  const availableDays = previousDay 
    ? allDays.filter(d => d !== previousDay)
    : allDays;
  
  // Use multiple seed transformations for better randomness
  const seed = weekSeed * 7919 + 4831; // Prime numbers for better distribution
  return getRandomItem(availableDays, seed);
}

// Get a random pair of employees
function getRandomPair(weekSeed: number): [string, string] {
  const pairs: [string, string][] = [
    ["tyler", "claudia"],
    ["tyler", "nalleli"],
    ["tyler", "ana"],
    ["nalleli", "claudia"],
    ["nalleli", "ana"],
    ["claudia", "ana"],
  ];
  
  const seed = weekSeed * 6571 + 3259; // Different primes
  return getRandomItem(pairs, seed);
}

// Get random balance check employee (excluding Nalleli)
function getRandomBalanceEmployee(weekSeed: number): string {
  const employees = ["tyler", "claudia", "ana"];
  const seed = weekSeed * 5381 + 2143;
  return getRandomItem(employees, seed);
}

export interface WeekSchedule {
  weekStartDate: Date;
  auditEmployee1: string;
  auditEmployee2: string;
  auditDay: number;
  balanceCheckEmployee: string;
}

// Generate schedule for a specific week
export function generateWeekSchedule(
  weekStart: Date,
  referenceWeekStart: Date,
  previousWeekDay?: number
): WeekSchedule {
  const weeksDiff = differenceInWeeks(weekStart, referenceWeekStart);
  
  // Use week difference as seed base
  const weekSeed = weeksDiff + 1000; // Offset to avoid seed of 0
  
  const [emp1, emp2] = getRandomPair(weekSeed);
  const auditDay = getRandomAuditDay(weekSeed, previousWeekDay);
  const balanceEmployee = getRandomBalanceEmployee(weekSeed);
  
  return {
    weekStartDate: weekStart,
    auditEmployee1: emp1,
    auditEmployee2: emp2,
    auditDay,
    balanceCheckEmployee: balanceEmployee,
  };
}

// Generate multiple weeks of schedules
export function generateSchedules(
  startWeek: Date,
  numberOfWeeks: number
): WeekSchedule[] {
  const schedules: WeekSchedule[] = [];
  const referenceWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = startOfWeek(
      new Date(startWeek.getTime() + i * 7 * 24 * 60 * 60 * 1000),
      { weekStartsOn: 1 }
    );
    
    const previousDay = schedules[i - 1]?.auditDay;
    const schedule = generateWeekSchedule(weekStart, referenceWeek, previousDay);
    schedules.push(schedule);
  }
  
  return schedules;
}
