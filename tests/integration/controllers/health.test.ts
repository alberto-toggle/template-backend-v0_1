const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required for tests');
}

process.env.DATABASE_URL = databaseUrl;
process.env.SERVICE_NAME = process.env.SERVICE_NAME ?? 'microservice-name';
process.env.SERVICE_VERSION = process.env.SERVICE_VERSION ?? '0.1.0';
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

test('GET /health returns HealthStatus with checks', async () => {
  const res = await app.inject({ method: 'GET', url: '/health' });

  // 200 when healthy, 503 when degraded or unhealthy
  expect([200, 503]).toContain(res.statusCode);

  const body = res.json();
  expect(['healthy', 'unhealthy', 'degraded']).toContain(body.status);
  expect(body.service).toBe('microservice-name');
  expect(typeof body.version).toBe('string');
  expect(body.timestamp).toBeDefined();
  expect(body.checks).toEqual({
    sqlserver: expect.objectContaining({
      status: expect.stringMatching(/^up|down|degraded$/),
      responseTime: expect.any(Number)
    }),
    mongodb: expect.objectContaining({
      status: expect.stringMatching(/^up|down|degraded$/),
      responseTime: expect.any(Number)
    }),
    s3: expect.objectContaining({
      status: expect.stringMatching(/^up|down|degraded$/),
      responseTime: expect.any(Number)
    }),
    secretsManager: expect.objectContaining({
      status: expect.stringMatching(/^up|down|degraded$/),
      responseTime: expect.any(Number)
    })
  });
});
