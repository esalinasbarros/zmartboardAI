import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users with different roles
  const users = [
    {
      email: 'user@example.com',
      username: 'regular_user',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
      emailVerified: true,
    },
    {
      email: 'moderator@example.com',
      username: 'moderator_user',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.MODERATOR,
      emailVerified: true,
    },
    {
      email: 'admin@example.com',
      username: 'admin_user',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Johnson',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
    {
      email: 'superadmin@example.com',
      username: 'super_admin',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Wilson',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  ];

  // Create users one by one
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.username} (${user.role})`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });