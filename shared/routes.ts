import { z } from 'zod';
import { 
  insertPostSchema, insertEmissoraSchema, insertEditorialSchema, insertTemaEditorialSchema,
  posts, emissoras, editoriais, temaEditoriais
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts' as const,
      responses: { 200: z.array(z.custom<typeof posts.$inferSelect>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/posts/:id' as const,
      responses: { 200: z.custom<typeof posts.$inferSelect>(), 404: errorSchemas.notFound },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts' as const,
      input: insertPostSchema,
      responses: { 201: z.custom<typeof posts.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/posts/:id' as const,
      input: insertPostSchema.partial(),
      responses: { 200: z.custom<typeof posts.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/posts/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    }
  },
  emissoras: {
    list: {
      method: 'GET' as const,
      path: '/api/emissoras' as const,
      responses: { 200: z.array(z.custom<typeof emissoras.$inferSelect>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/emissoras/:id' as const,
      responses: { 200: z.custom<typeof emissoras.$inferSelect>(), 404: errorSchemas.notFound },
    },
    create: {
      method: 'POST' as const,
      path: '/api/emissoras' as const,
      input: insertEmissoraSchema,
      responses: { 201: z.custom<typeof emissoras.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/emissoras/:id' as const,
      input: insertEmissoraSchema.partial(),
      responses: { 200: z.custom<typeof emissoras.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/emissoras/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    }
  },
  editoriais: {
    list: {
      method: 'GET' as const,
      path: '/api/editoriais' as const,
      responses: { 200: z.array(z.custom<typeof editoriais.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/editoriais' as const,
      input: insertEditorialSchema,
      responses: { 201: z.custom<typeof editoriais.$inferSelect>(), 400: errorSchemas.validation },
    }
  },
  temaEditoriais: {
    list: {
      method: 'GET' as const,
      path: '/api/tema-editoriais' as const,
      responses: { 200: z.array(z.custom<typeof temaEditoriais.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tema-editoriais' as const,
      input: insertTemaEditorialSchema,
      responses: { 201: z.custom<typeof temaEditoriais.$inferSelect>(), 400: errorSchemas.validation },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
