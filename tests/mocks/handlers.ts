import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.test.com/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]);
  }),

  http.post('https://api.test.com/users', () => {
    return HttpResponse.json(
      { id: 3, name: 'New User', email: 'new@example.com' },
      { status: 201 }
    );
  }),

  http.get('https://api.test.com/error', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }),

  http.get('https://api.test.com/rate-limit', () => {
    return HttpResponse.json(
      { error: 'Too Many Requests' },
      { status: 429 }
    );
  }),

  http.get('https://api.test.com/timeout', () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({ message: 'This will timeout' }));
      }, 15000);
    });
  })
];