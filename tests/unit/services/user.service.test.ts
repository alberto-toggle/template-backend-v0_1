const databaseUrl =
  process.env.DATABASE_URL ??
  'sqlserver://localhost:1433;database=microservice_db;user=sa;password=YourStrongPassw0rd;encrypt=true;trustServerCertificate=true';

process.env.DATABASE_URL = databaseUrl;

let prisma: import('@prisma/client').PrismaClient;
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
    name: 'Unit Test'
  });

  const fetched = await userService.getUserById(created.id);
  expect(fetched?.email).toBe('unit@example.com');
  expect(fetched?.name).toBe('Unit Test');
});
