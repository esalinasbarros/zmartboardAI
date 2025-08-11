"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
        {
            email: 'user@example.com',
            username: 'regular_user',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: client_1.UserRole.USER,
            emailVerified: true,
        },
        {
            email: 'moderator@example.com',
            username: 'moderator_user',
            password: hashedPassword,
            firstName: 'Jane',
            lastName: 'Smith',
            role: client_1.UserRole.MODERATOR,
            emailVerified: true,
        },
        {
            email: 'admin@example.com',
            username: 'admin_user',
            password: hashedPassword,
            firstName: 'Bob',
            lastName: 'Johnson',
            role: client_1.UserRole.ADMIN,
            emailVerified: true,
        },
        {
            email: 'superadmin@example.com',
            username: 'super_admin',
            password: hashedPassword,
            firstName: 'Alice',
            lastName: 'Wilson',
            role: client_1.UserRole.SUPER_ADMIN,
            emailVerified: true,
        },
    ];
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
//# sourceMappingURL=seed.js.map