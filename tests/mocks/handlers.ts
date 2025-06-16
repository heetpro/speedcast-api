import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.test.com/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ])
    );
  }),

  rest.post('https://api.test.com/users', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: 3, name: 'New User', email: 'new@example.com' })
    );
  }),

  rest.get('https://api.test.com/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal Server Error' })
    );
  }),

  rest.get('https://api.test.com/rate-limit', (req, res, ctx) => {
    return res(
      ctx.status(429),
      ctx.json({ error: 'Too Many Requests' })
    );
  }),

  rest.get('https://api.test.com/timeout', (req, res, ctx) => {
    return res(
      ctx.delay(15000),
      ctx.status(200),
      ctx.json({ message: 'This will timeout' })
    );
  })
];