import {
  posts, emissoras, editoriais, temaEditoriais, usuarios, media,
  type Post, type CreatePostRequest, type UpdatePostRequest,
  type Emissora, type CreateEmissoraRequest,
  type Editorial, type CreateEditorialRequest,
  type TemaEditorial, type CreateTemaEditorialRequest,
  type Usuario, type CreateMediaRequest, type Media
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<Usuario | undefined>;
  getUserByEmail(email: string): Promise<Usuario | undefined>;
  getUsers(): Promise<Usuario[]>;
  createUser(user: any): Promise<Usuario>;

  // Posts
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: CreatePostRequest): Promise<Post>;
  updatePost(id: number, updates: UpdatePostRequest): Promise<Post>;
  deletePost(id: number): Promise<void>;

  // Emissoras
  getEmissoras(): Promise<Emissora[]>;
  getEmissora(id: number): Promise<Emissora | undefined>;
  createEmissora(emissora: CreateEmissoraRequest): Promise<Emissora>;
  updateEmissora(id: number, updates: Partial<CreateEmissoraRequest>): Promise<Emissora>;
  deleteEmissora(id: number): Promise<void>;

  // Editoriais
  getEditoriais(): Promise<Editorial[]>;
  createEditorial(editorial: CreateEditorialRequest): Promise<Editorial>;

  // TemaEditoriais
  getTemaEditoriais(): Promise<TemaEditorial[]>;
  createTemaEditorial(tema: CreateTemaEditorialRequest): Promise<TemaEditorial>;

  // Media
  getMedia(): Promise<Media[]>;
  createMedia(media: CreateMediaRequest): Promise<Media>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<Usuario | undefined> {
    const [user] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    return user;
  }
  async getUserByEmail(email: string): Promise<Usuario | undefined> {
    const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    return user;
  }
  async getUsers(): Promise<Usuario[]> {
    return await db.select().from(usuarios);
  }
  async createUser(user: any): Promise<Usuario> {
    const [newUser] = await db.insert(usuarios).values(user).returning();
    return newUser;
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: CreatePostRequest): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: UpdatePostRequest): Promise<Post> {
    const [updated] = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();
    return updated;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Emissoras
  async getEmissoras(): Promise<Emissora[]> {
    return await db.select().from(emissoras);
  }

  async getEmissora(id: number): Promise<Emissora | undefined> {
    const [emissora] = await db.select().from(emissoras).where(eq(emissoras.id, id));
    return emissora;
  }

  async createEmissora(emissora: CreateEmissoraRequest): Promise<Emissora> {
    const [newEmissora] = await db.insert(emissoras).values(emissora).returning();
    return newEmissora;
  }

  async updateEmissora(id: number, updates: Partial<CreateEmissoraRequest>): Promise<Emissora> {
    const [updated] = await db.update(emissoras).set(updates).where(eq(emissoras.id, id)).returning();
    return updated;
  }

  async deleteEmissora(id: number): Promise<void> {
    await db.delete(emissoras).where(eq(emissoras.id, id));
  }

  // Editoriais
  async getEditoriais(): Promise<Editorial[]> {
    return await db.select().from(editoriais);
  }

  async createEditorial(editorial: CreateEditorialRequest): Promise<Editorial> {
    const [newEditorial] = await db.insert(editoriais).values(editorial).returning();
    return newEditorial;
  }

  // TemaEditoriais
  async getTemaEditoriais(): Promise<TemaEditorial[]> {
    return await db.select().from(temaEditoriais);
  }

  async createTemaEditorial(tema: CreateTemaEditorialRequest): Promise<TemaEditorial> {
    const [newTema] = await db.insert(temaEditoriais).values(tema).returning();
    return newTema;
  }

  // Media
  async getMedia(): Promise<Media[]> {
    return await db.select().from(media);
  }
  async createMedia(m: CreateMediaRequest): Promise<Media> {
    const [newMedia] = await db.insert(media).values(m).returning();
    return newMedia;
  }
}

export const storage = new DatabaseStorage();
