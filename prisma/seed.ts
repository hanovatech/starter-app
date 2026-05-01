import 'dotenv/config';
import { PrismaClient } from '../src/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // CUSTOMIZE: Change email and password for your project
  const password = await bcrypt.hash('admin', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      displayName: 'Admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });

  console.log('Seeding complete.');
  console.log('  Login: admin@example.com / admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
