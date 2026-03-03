import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Funcoes (Roles)
export const funcoes = pgTable("funcoes", {
  id: serial("id").primaryKey(),
  tipoFuncao: text("tipo_funcao").notNull(),
});

// TemaEditorial (Colors and Visuals)
export const temaEditoriais = pgTable("tema_editoriais", {
  id: serial("id").primaryKey(),
  descricao: text("descricao").notNull(),
  corPrimaria: text("cor_primaria").notNull(),
  corSecundaria: text("cor_secundaria").notNull(),
  corFonte: text("cor_fonte").notNull(),
  logo: text("logo").notNull(),
});

// Editorial
export const editoriais = pgTable("editoriais", {
  id: serial("id").primaryKey(),
  tipoPostagem: text("tipo_postagem").notNull(),
  temaEditorialId: integer("tema_editorial_id").references(() => temaEditoriais.id),
});

// Emissora
export const emissoras = pgTable("emissoras", {
  id: serial("id").primaryKey(),
  nomeSocial: text("nome_social").notNull(),
  razaoSocial: text("razao_social").notNull(),
  slug: text("slug").notNull(),
  logo: text("logo").notNull(),
  temaPrincipal: text("tema_principal").notNull(),
  ativa: boolean("ativa").notNull().default(true),
});

// Usuario
export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  nomeCompleto: text("nome_completo").notNull(),
  senhaHash: text("senha_hash").notNull(),
  statusUsuario: integer("status_usuario").notNull().default(1),
  funcaoId: integer("funcao_id").references(() => funcoes.id),
  dataCriacao: timestamp("data_criacao").defaultNow(),
});

// Post
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  subtitulo: text("subtitulo").notNull(),
  conteudo: text("conteudo").notNull(),
  imagem: text("imagem"),
  slug: text("slug").notNull(),
  editorialId: integer("editorial_id").references(() => editoriais.id),
  emissoraId: integer("emissora_id").references(() => emissoras.id),
  usuarioCriacaoId: integer("usuario_criacao_id").references(() => usuarios.id),
  statusPost: integer("status_post").notNull().default(1), // 1 = Rascunho, 2 = Publicado
  dataCriacao: timestamp("data_criacao").defaultNow(),
  publicadoEm: timestamp("publicado_em"),
});

// Base Schemas
export const insertFuncaoSchema = createInsertSchema(funcoes).omit({ id: true });
export const insertTemaEditorialSchema = createInsertSchema(temaEditoriais).omit({ id: true });
export const insertEditorialSchema = createInsertSchema(editoriais).omit({ id: true });
export const insertEmissoraSchema = createInsertSchema(emissoras).omit({ id: true });
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({ id: true, dataCriacao: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, dataCriacao: true });

// Types
export type Usuario = typeof usuarios.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Emissora = typeof emissoras.$inferSelect;
export type Editorial = typeof editoriais.$inferSelect;
export type TemaEditorial = typeof temaEditoriais.$inferSelect;
export type Funcao = typeof funcoes.$inferSelect;

export type CreatePostRequest = z.infer<typeof insertPostSchema>;
export type UpdatePostRequest = Partial<CreatePostRequest>;
export type CreateEmissoraRequest = z.infer<typeof insertEmissoraSchema>;
export type CreateEditorialRequest = z.infer<typeof insertEditorialSchema>;
export type CreateTemaEditorialRequest = z.infer<typeof insertTemaEditorialSchema>;
