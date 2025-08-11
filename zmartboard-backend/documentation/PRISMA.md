# Prisma Workflow

This document outlines the proper workflow for using Prisma in this project.

## Creating a New Migration

When you make changes to the `prisma/schema.prisma` file, you need to create a new migration to apply those changes to the database.

To create a new migration, run the following command:

```bash
docker exec -it zmart-board-backend-backend-1 npx prisma migrate dev --name <migration-name>
docker exec -it zmart-board-backend-backend-1 npx prisma migrate deploy
```

Replace `<migration-name>` with a descriptive name for your migration (e.g., `add-user-model`).

This command will:

1.  Create a new SQL migration file in the `prisma/migrations` directory.
2.  Apply the migration to your local database.
3.  Generate the Prisma Client.

## Applying Migrations

To apply all pending migrations to the database, run the following command:

```bash
npx prisma migrate deploy
```

This command is typically used in production environments.

## Generating the Prisma Client

The Prisma Client is a type-safe database client that is generated from your Prisma schema. It is automatically generated when you run `prisma migrate dev`, but you can also generate it manually by running the following command:

```bash
npx prisma generate
```

You should run this command whenever you make changes to the `prisma/schema.prisma` file.

## Reverting Migrations

To revert the last applied migration, run the following command:

```bash
npx prisma migrate reset
```

## Resetting the Database

To reset the database to its initial state, run the following command:

```bash
npx prisma migrate reset
```

This command will drop the database, recreate it, and apply all migrations.

## Seeding the Database

To seed the database with initial data, you can create a `seed.ts` file in the `prisma` directory and add a `seed` script to your `package.json` file.

**`prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add your seed data here
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**`package.json`**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

To seed the database, run the following command:

```bash
npx prisma db seed
```
