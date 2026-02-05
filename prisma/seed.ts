import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'alice@example.com', status: 'ACTIVE' },
    { email: 'bob@example.com', status: 'SUSPENDED' }
  ];

  const seededUsers = [];
  for (const user of users) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: { status: user.status },
      create: user
    });
    seededUsers.push(upserted);
  }

  const targetUser = seededUsers[0];
  if (!targetUser) return;

  const moduleCodes = ['USERS_ADMIN', 'AUDIT_LOGS', 'BILLING_VIEW'];
  for (const moduleCode of moduleCodes) {
    await prisma.modulePermission.upsert({
      where: {
        userId_moduleCode: {
          userId: targetUser.id,
          moduleCode
        }
      },
      update: {},
      create: { userId: targetUser.id, moduleCode }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
