import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono().basePath('v1')

type User = {
  name: string
  age: number
}

const users = new Set<User>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/users', (c) => {
  return c.json(Array.from(users))
})

app.post('/users', async (c) => {
  const input = await c.req.json()

  users.add(input)

  return c.json(null)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
