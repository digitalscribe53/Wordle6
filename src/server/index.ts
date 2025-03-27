// src/server/index.ts
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from '@hono/node-server/serve-static';
import { getRandomWord, isValidWord } from './services/wordService.ts';

const app = new Hono();

// Middleware
app.use('*', logger());

// API Routes
app.get('/api/word', (c) => {
  return c.json({ word: getRandomWord() });
});

app.post('/api/validate', async (c) => {
  const { word } = await c.req.json();
  
  if (!word || typeof word !== 'string') {
    return c.json({ valid: false, error: 'Invalid input' }, 400);
  }
  
  return c.json({ valid: isValidWord(word) });
});

// Serve static files from the dist directory (where React will be built)
app.use('/*', serveStatic({ root: './dist' }));

// Catch-all route to serve the index.html for client-side routing
app.get('*', (c) => {
  return c.html('<html><body><div id="root"></div><script src="/assets/index.js"></script></body></html>');
});

// Start the server
const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch
};