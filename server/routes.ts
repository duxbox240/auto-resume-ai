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
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      if (!response.choices[0].message.content) {
        throw new Error("No content in OpenAI response");
      }

      const result = JSON.parse(response.choices[0].message.content);
      res.json(result);
    } catch (error) {
      console.error("OpenAI Error:", error);
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
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      if (!response.choices[0].message.content) {
        throw new Error("No content in OpenAI response");
      }

      const result = JSON.parse(response.choices[0].message.content);
      res.json(result);
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: "Failed to suggest skills" });
    }
  });

  app.post("/api/generate-resume", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { jobTitle, yearsOfExperience, industry, skills } = req.body;

    const prompt = `Create a professional resume for a ${jobTitle} with ${yearsOfExperience} years of experience in the ${industry} industry. Include work experience, education, and incorporate these skills: ${skills.join(", ")}.

Generate the content in a natural, professional style with specific examples and achievements. The response should be a JSON object with this structure:
{
  "personalDetails": {
    "summary": "Professional summary here..."
  },
  "workExperience": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "City, Country",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "Detailed job description with achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "Institution name",
      "location": "City, Country",
      "graduationYear": "YYYY"
    }
  ],
  "skills": ["Skill 1", "Skill 2", ...]
}

Make the content realistic and professional, with specific achievements and metrics where appropriate.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      if (!response.choices[0].message.content) {
        throw new Error("No content in OpenAI response");
      }

      const generatedContent = JSON.parse(response.choices[0].message.content);

      // Validate the generated content against our schema
      const validatedContent = resumeContentSchema.parse({
        ...generatedContent,
        personalDetails: {
          ...generatedContent.personalDetails,
          fullName: "",
          email: "",
          phone: "",
          location: "",
          profilePicture: "",
        }
      });

      res.json(validatedContent);
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: "Failed to generate resume content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}