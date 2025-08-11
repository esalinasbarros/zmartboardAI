## Command to apply migrations

```docker-compose exec app npx prisma migrate dev --name <migration-name>```

## Command to migrate the database

```docker-compose exec app npx prisma migrate deploy```

## Command to seed the database
```docker-compose exec app npx ts-node prisma/seed.ts```

Or this
```
docker compose exec app yarn db:seed
```

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ docker-compose exec app yarn run test

# e2e tests
$ docker-compose exec app yarn run test:e2e

# test coverage
$ docker-compose exec app yarn run test:cov
```

## DB connection via docker desktop
```sql
psql -U user -d mydb
```


