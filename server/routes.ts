import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: "keyboard cat"
    })
  );

  // Auth
  app.post(api.auth.login.path, async (req, res) => {
    const { email, password } = req.body;
    const user = await storage.getUserByEmail(email);
    if (!user || user.senhaHash !== password) { // Simplificado para MVP
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    (req.session as any).userId = user.id;
    res.json({ user });
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "Não autorizado" });
    const user = await storage.getUser(userId);
    res.json(user);
  });

  // Posts
  app.get(api.posts.list.path, async (req, res) => {
    const data = await storage.getPosts();
    res.json(data);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const item = await storage.getPost(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Post não encontrado" });
    res.json(item);
  });

  app.post(api.posts.create.path, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const data = await storage.createPost(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.posts.update.path, async (req, res) => {
    try {
      const input = api.posts.update.input.parse(req.body);
      const data = await storage.updatePost(Number(req.params.id), input);
      res.json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.posts.delete.path, async (req, res) => {
    await storage.deletePost(Number(req.params.id));
    res.status(204).end();
  });

  // Emissoras
  app.get(api.emissoras.list.path, async (req, res) => {
    const data = await storage.getEmissoras();
    res.json(data);
  });

  app.post(api.emissoras.create.path, async (req, res) => {
    const data = await storage.createEmissora(api.emissoras.create.input.parse(req.body));
    res.status(201).json(data);
  });

  // Editoriais
  app.get(api.editoriais.list.path, async (req, res) => {
    const data = await storage.getEditoriais();
    res.json(data);
  });

  app.post(api.editoriais.create.path, async (req, res) => {
    const data = await storage.createEditorial(api.editoriais.create.input.parse(req.body));
    res.status(201).json(data);
  });

  // TemaEditoriais
  app.get(api.temaEditoriais.list.path, async (req, res) => {
    const data = await storage.getTemaEditoriais();
    res.json(data);
  });

  app.post(api.temaEditoriais.create.path, async (req, res) => {
    const data = await storage.createTemaEditorial(api.temaEditoriais.create.input.parse(req.body));
    res.status(201).json(data);
  });

  // Media
  app.get(api.media.list.path, async (req, res) => {
    const data = await storage.getMedia();
    res.json(data);
  });

  app.post(api.media.create.path, async (req, res) => {
    const data = await storage.createMedia(api.media.create.input.parse(req.body));
    res.status(201).json(data);
  });

  // Usuarios
  app.get(api.usuarios.list.path, async (req, res) => {
    const data = await storage.getUsers();
    res.json(data);
  });

  app.post(api.usuarios.create.path, async (req, res) => {
    const data = await storage.createUser(api.usuarios.create.input.parse(req.body));
    res.status(201).json(data);
  });

  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const admin = await storage.getUserByEmail("admin@gtf.com");
  if (!admin) {
    await storage.createUser({
      email: "admin@gtf.com",
      nomeCompleto: "Administrador GTF",
      senhaHash: "admin123",
      statusUsuario: 1,
      funcaoId: null
    });
  }
}
