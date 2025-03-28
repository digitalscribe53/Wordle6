// src/server/index.ts
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { getRandomWord, isValidWord } from './data/words.js';

const app = new Hono();

// Middleware
app.use('*', logger());

// CORS headers for development
app.use('*', async (c, next) => {
  // Add CORS headers
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS requests
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }
  
  await next();
});

// API Routes
app.get('/api/word', (c) => {
  return c.json({ word: getRandomWord() });
});

app.post('/api/validate', async (c) => {
  try {
    const body = await c.req.json();
    const word = body.word;
    
    if (!word || typeof word !== 'string') {
      return c.json({ valid: false, error: 'Invalid input' }, 400);
    }
    
    // Check if the word is in our dictionary
    return c.json({ valid: isValidWord(word) });
  } catch (error) {
    console.error('Error validating word:', error);
    return c.json({ valid: false, error: 'Server error' }, 500);
  }
});

// Serve static files from the public directory
// app.use('/static/*', serveStatic({ root: './public' }));

// Catch-all route for SPA - we'll address this properly later
app.get('*', (c) => {
  return c.html('<html><body><h1>Wordle6</h1><p>Server is running!</p></body></html>');
});

// Start the server
const port = 3000;
console.log(`Server is running on port ${port}`);

// Export the Hono app
serve({
  fetch: app.fetch,
  port
});