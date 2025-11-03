import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssignmentSchema } from "@shared/schema";
import { 
  createWeekAssignment, 
  generateNextWeek, 
  validateAssignment,
  generateAssignment 
} from "./scheduler";
import { sendAssignmentNotifications } from "./emailService";
import { startOfWeek, parseISO } from "date-fns";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all assignments
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  // Get assignment by ID
  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await storage.getAssignment(id);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });

  // Get assignment for a specific week
  app.get("/api/assignments/week/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const weekDate = startOfWeek(parseISO(date), { weekStartsOn: 1 });
      const assignment = await storage.getAssignmentByWeek(weekDate);
      
      if (!assignment) {
        return res.status(404).json({ message: "No assignment found for this week" });
      }
      
      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment by week:", error);
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });

  // Get recent assignments (for history)
  app.get("/api/assignments/recent/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const assignments = await storage.getRecentAssignments(limit);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching recent assignments:", error);
      res.status(500).json({ message: "Failed to fetch recent assignments" });
    }
  });

  // Create a new assignment (manual override)
  app.post("/api/assignments", async (req, res) => {
    try {
      const data = insertAssignmentSchema.parse({
        ...req.body,
        weekStartDate: new Date(req.body.weekStartDate),
      });

      // Validate constraints
      const validation = await validateAssignment(data);
      if (!validation.valid) {
        return res.status(400).json({ 
          message: "Assignment validation failed",
          errors: validation.errors 
        });
      }

      const assignment = await storage.createAssignment(data);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  // Generate assignment for a specific week
  app.post("/api/assignments/generate", async (req, res) => {
    try {
      const { weekStartDate } = req.body;
      const weekDate = startOfWeek(new Date(weekStartDate), { weekStartsOn: 1 });
      
      const assignment = await createWeekAssignment(weekDate);
      res.status(201).json(assignment);
    } catch (error: any) {
      if (error.message === "Assignment already exists for this week") {
        return res.status(409).json({ message: error.message });
      }
      console.error("Error generating assignment:", error);
      res.status(500).json({ message: "Failed to generate assignment" });
    }
  });

  // Generate next week's assignment
  app.post("/api/assignments/generate-next", async (req, res) => {
    try {
      const assignment = await generateNextWeek();
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error generating next week:", error);
      res.status(500).json({ message: "Failed to generate next week's assignment" });
    }
  });

  // Update an assignment
  app.put("/api/assignments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertAssignmentSchema.partial().parse({
        ...req.body,
        weekStartDate: req.body.weekStartDate ? new Date(req.body.weekStartDate) : undefined,
      });

      // If we're updating constraint-relevant fields, validate
      if (updateData.auditEmployee1 || updateData.auditEmployee2 || updateData.auditDay) {
        const existing = await storage.getAssignment(id);
        if (!existing) {
          return res.status(404).json({ message: "Assignment not found" });
        }

        const merged = { ...existing, ...updateData };
        const validation = await validateAssignment(merged);
        if (!validation.valid) {
          return res.status(400).json({ 
            message: "Assignment validation failed",
            errors: validation.errors 
          });
        }
      }

      const updated = await storage.updateAssignment(id, updateData);
      
      if (!updated) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      console.error("Error updating assignment:", error);
      res.status(500).json({ message: "Failed to update assignment" });
    }
  });

  // Delete an assignment
  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAssignment(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ message: "Failed to delete assignment" });
    }
  });

  // Send email notifications for an assignment
  app.post("/api/assignments/:id/send-notifications", async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await storage.getAssignment(id);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      await sendAssignmentNotifications(assignment);
      res.json({ message: "Notifications sent successfully" });
    } catch (error) {
      console.error("Error sending notifications:", error);
      res.status(500).json({ message: "Failed to send notifications" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
