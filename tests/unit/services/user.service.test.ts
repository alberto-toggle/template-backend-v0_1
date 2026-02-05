const databaseUrl =
  process.env.DATABASE_URL ??
  'sqlserver://sa:YourStrong!Passw0rd@localhost:1433;database=microservice_db;encrypt=true;trustServerCertificate=true';

process.env.DATABASE_URL = databaseUrl;

let prisma: typeof import('@prisma/client').PrismaClient;
let userService: typeof import('@src/services/users/user.service.js');

beforeAll(async () => {
  const prismaMod = await import('@prisma/client');
  prisma = new prismaMod.PrismaClient();
  await prisma.user.deleteMany();
  userService = await import('@src/services/users/user.service.js');
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('createUser creates and getUserById retrieves user', async () => {
  const created = await userService.createUser({
    email: 'unit@example.com',
    status: 'ACTIVE'
  });

  const fetched = await userService.getUserById(created.id);
  expect(fetched?.email).toBe('unit@example.com');
  expect(fetched?.status).toBe('ACTIVE');
});
