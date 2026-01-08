import { writable } from 'svelte/store';

export const projectsStore = writable([]);

export const techStackOptions = {
  frontend: ['SvelteKit', 'React', 'Vue', 'Next.js', 'Angular', 'Nuxt'],
  uiFramework: ['Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Shadcn UI', 'Ant Design'],
  backend: ['Node.js', 'Express', 'Fastify', 'NestJS', 'SvelteKit API', 'Hono'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Supabase', 'Firebase'],
  tools: ['TypeScript', 'ESLint', 'Prettier', 'Vitest', 'Playwright', 'Docker']
};
