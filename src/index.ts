import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', logger())

// For serveStatic, the syntax may have changed in newer versions
// Let's try with the correct options
app.use('/static/*', serveStatic({ root: './public' }))
// If that doesn't work, try:
// app.use('/static/*', serveStatic())

// Routes
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Wordle6 API' })
})

// Game related endpoints
app.get('/api/word', (c) => {
  // Your logic to get a random word
  return c.json({ word: 'PUZZLE' })
})

// Start the server
const port = 3000
console.log(`Server is running on port ${port}`)

export default {
  port,
  fetch: app.fetch
}