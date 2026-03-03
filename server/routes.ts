import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Posts
  app.get(api.posts.list.path, async (req, res) => {
    const data = await storage.getPosts();
    res.json(data);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const item = await storage.getPost(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Post not found" });
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

  app.get(api.emissoras.get.path, async (req, res) => {
    const item = await storage.getEmissora(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Emissora not found" });
    res.json(item);
  });

  app.post(api.emissoras.create.path, async (req, res) => {
    try {
      const input = api.emissoras.create.input.parse(req.body);
      const data = await storage.createEmissora(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.emissoras.update.path, async (req, res) => {
    try {
      const input = api.emissoras.update.input.parse(req.body);
      const data = await storage.updateEmissora(Number(req.params.id), input);
      res.json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.emissoras.delete.path, async (req, res) => {
    await storage.deleteEmissora(Number(req.params.id));
    res.status(204).end();
  });

  // Editoriais
  app.get(api.editoriais.list.path, async (req, res) => {
    const data = await storage.getEditoriais();
    res.json(data);
  });

  app.post(api.editoriais.create.path, async (req, res) => {
    try {
      const input = api.editoriais.create.input.parse(req.body);
      const data = await storage.createEditorial(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // TemaEditoriais
  app.get(api.temaEditoriais.list.path, async (req, res) => {
    const data = await storage.getTemaEditoriais();
    res.json(data);
  });

  app.post(api.temaEditoriais.create.path, async (req, res) => {
    try {
      const input = api.temaEditoriais.create.input.parse(req.body);
      const data = await storage.createTemaEditorial(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const temas = await storage.getTemaEditoriais();
  if (temas.length === 0) {
    const tema = await storage.createTemaEditorial({
      descricao: "Tema Principal Padrão",
      corPrimaria: "#1d4ed8",
      corSecundaria: "#3b82f6",
      corFonte: "#ffffff",
      logo: "https://placehold.co/400x200?text=Logo+Aqui"
    });
    
    const editorial = await storage.createEditorial({
      tipoPostagem: "Notícias",
      temaEditorialId: tema.id
    });

    const emissora = await storage.createEmissora({
      nomeSocial: "Emissora Exemplo",
      razaoSocial: "Emissora S/A",
      slug: "emissora-exemplo",
      logo: "https://placehold.co/400x200?text=Logo+Emissora",
      temaPrincipal: "Padrão",
      ativa: true
    });

    await storage.createPost({
      titulo: "Bem-vindo ao Novo CMS",
      subtitulo: "Primeira postagem de teste",
      conteudo: "Este é o conteúdo detalhado da nossa primeira postagem de teste.",
      slug: "bem-vindo-ao-novo-cms",
      editorialId: editorial.id,
      emissoraId: emissora.id,
      statusPost: 2,
    });
  }
}
