import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { openai } from "./openai";
import { z } from "zod";
import { resumeContentSchema } from "@shared/schema";

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

  // AI suggestions routes
  app.post("/api/suggestions/summary", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const prompt = `Create a compelling professional summary for a ${req.body.title} based on their work experience. Make it concise, impactful, and highlight key achievements:

Work Experience: ${JSON.stringify(req.body.workExperience)}

Return the response as JSON in this format: { "summary": "generated text here" }`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  app.post("/api/suggestions/skills", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const prompt = `Suggest relevant professional skills based on the following job titles and experience. Return them as a JSON array of strings:

Work Experience: ${JSON.stringify(req.body.workExperience)}

Return the response as JSON in this format: { "skills": ["skill1", "skill2", ...] }`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to suggest skills" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}