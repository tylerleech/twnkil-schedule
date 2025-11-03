import { type User, type InsertUser, type Assignment, type InsertAssignment } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users, assignments } from "@shared/schema";
import { eq, desc, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assignment methods
  getAssignment(id: string): Promise<Assignment | undefined>;
  getAssignmentByWeek(weekStartDate: Date): Promise<Assignment | undefined>;
  getAllAssignments(): Promise<Assignment[]>;
  getRecentAssignments(limit: number): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;
  getPreviousAssignment(weekStartDate: Date): Promise<Assignment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assignments: Map<string, Assignment>;

  constructor() {
    this.users = new Map();
    this.assignments = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async getAssignmentByWeek(weekStartDate: Date): Promise<Assignment | undefined> {
    return Array.from(this.assignments.values()).find(
      (assignment) => assignment.weekStartDate.getTime() === weekStartDate.getTime()
    );
  }

  async getAllAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).sort(
      (a, b) => b.weekStartDate.getTime() - a.weekStartDate.getTime()
    );
  }

  async getRecentAssignments(limit: number): Promise<Assignment[]> {
    const all = await this.getAllAssignments();
    return all.slice(0, limit);
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = randomUUID();
    const assignment: Assignment = {
      ...insertAssignment,
      id,
      notes: insertAssignment.notes ?? null,
      createdAt: new Date(),
    };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async updateAssignment(id: string, updateData: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const assignment = this.assignments.get(id);
    if (!assignment) return undefined;
    
    const updated = { ...assignment, ...updateData };
    this.assignments.set(id, updated);
    return updated;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    return this.assignments.delete(id);
  }

  async getPreviousAssignment(weekStartDate: Date): Promise<Assignment | undefined> {
    const all = await this.getAllAssignments();
    return all.find((a) => a.weekStartDate < weekStartDate);
  }
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    const result = await db.query.assignments.findFirst({
      where: eq(assignments.id, id),
    });
    return result;
  }

  async getAssignmentByWeek(weekStartDate: Date): Promise<Assignment | undefined> {
    const result = await db.query.assignments.findFirst({
      where: eq(assignments.weekStartDate, weekStartDate),
    });
    return result;
  }

  async getAllAssignments(): Promise<Assignment[]> {
    const result = await db.query.assignments.findMany({
      orderBy: [desc(assignments.weekStartDate)],
    });
    return result;
  }

  async getRecentAssignments(limit: number): Promise<Assignment[]> {
    const result = await db.query.assignments.findMany({
      orderBy: [desc(assignments.weekStartDate)],
      limit,
    });
    return result;
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db
      .insert(assignments)
      .values(insertAssignment)
      .returning();
    return assignment;
  }

  async updateAssignment(id: string, updateData: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const [updated] = await db
      .update(assignments)
      .set(updateData)
      .where(eq(assignments.id, id))
      .returning();
    return updated;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await db
      .delete(assignments)
      .where(eq(assignments.id, id))
      .returning();
    return result.length > 0;
  }

  async getPreviousAssignment(weekStartDate: Date): Promise<Assignment | undefined> {
    const result = await db.query.assignments.findFirst({
      where: (assignments, { lt }) => lt(assignments.weekStartDate, weekStartDate),
      orderBy: [desc(assignments.weekStartDate)],
    });
    return result;
  }
}

export const storage = new DbStorage();
