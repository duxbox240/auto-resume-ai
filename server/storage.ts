import session from "express-session";
import createMemoryStore from "memorystore";
import { InsertUser, User, Resume, InsertResume } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResumes(userId: number): Promise<Resume[]>;
  getResume(id: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private currentUserId: number;
  private currentResumeId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.currentUserId = 1;
    this.currentResumeId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

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

  async getResumes(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    const newResume: Resume = {
      ...resume,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resumes.set(id, newResume);
    return newResume;
  }

  async updateResume(id: number, updates: Partial<InsertResume>): Promise<Resume> {
    const existing = this.resumes.get(id);
    if (!existing) {
      throw new Error('Resume not found');
    }
    
    const updated: Resume = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: number): Promise<void> {
    this.resumes.delete(id);
  }
}

export const storage = new MemStorage();
