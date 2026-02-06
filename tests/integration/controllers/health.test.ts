const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required for tests');
}

process.env.DATABASE_URL = databaseUrl;
process.env.SERVICE_NAME = process.env.SERVICE_NAME ?? 'microservice-name';
process.env.PORT = process.env.PORT ?? '3000';
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

let app: Awaited<ReturnType<typeof import('@src/app.js').buildApp>>;

beforeAll(async () => {
  const mod = await import('@src/app.js');
  app = await mod.buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('GET /health returns status and metadata', async () => {
  const res = await app.inject({ method: 'GET', url: '/health' });
  expect(res.statusCode).toBe(200);

  const body = res.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('microservice-name');
  expect(typeof body.uptimeSec).toBe('number');
  expect(typeof body.timestamp).toBe('string');
});
