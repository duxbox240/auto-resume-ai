import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Resume routes
  app.get("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const resumes = await storage.getResumes(req.user.id);
    res.json(resumes);
  });

  app.get("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const resume = await storage.getResume(Number(req.params.id));
    if (!resume || resume.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    res.json(resume);
  });

  app.post("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const resume = await storage.createResume({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(resume);
  });

  app.patch("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const resume = await storage.getResume(Number(req.params.id));
    if (!resume || resume.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    const updated = await storage.updateResume(resume.id, req.body);
    res.json(updated);
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const resume = await storage.getResume(Number(req.params.id));
    if (!resume || resume.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    await storage.deleteResume(resume.id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}