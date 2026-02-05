const databaseUrl =
  process.env.DATABASE_URL ??
  'sqlserver://sa:YourStrong!Passw0rd@localhost:1433;database=microservice_db;encrypt=true;trustServerCertificate=true';

process.env.DATABASE_URL = databaseUrl;
process.env.SERVICE_NAME = process.env.SERVICE_NAME ?? 'microservice-name';
process.env.PORT = process.env.PORT ?? '3000';
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

let app: Awaited<ReturnType<typeof import('@src/app.js').buildApp>>;
let prisma: typeof import('@prisma/client').PrismaClient;

beforeAll(async () => {
  const prismaMod = await import('@prisma/client');
  prisma = new prismaMod.PrismaClient();
  await prisma.user.deleteMany();

  const mod = await import('@src/app.js');
  app = await mod.buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

test('POST /users and GET /users/:id', async () => {
  const createRes = await app.inject({
    method: 'POST',
    url: '/users',
    payload: { email: 'jane@example.com', status: 'ACTIVE' }
  });

  expect(createRes.statusCode).toBe(201);
  const created = createRes.json();
  expect(created.email).toBe('jane@example.com');
  expect(created.status).toBe('ACTIVE');
  expect(typeof created.id).toBe('string');

  const getRes = await app.inject({
    method: 'GET',
    url: `/users/${created.id}`
  });

  expect(getRes.statusCode).toBe(200);
  const fetched = getRes.json();
  expect(fetched.id).toBe(created.id);
  expect(fetched.email).toBe('jane@example.com');
  expect(fetched.status).toBe('ACTIVE');
});
