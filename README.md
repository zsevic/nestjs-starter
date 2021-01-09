# nestjs-starter

> Minimal NestJS boilerplate

## Getting started

### Setup

```bash
git clone https://github.com/zsevic/nestjs-starter
cd nestjs-starter
cp .env.sample .env # change values after copying
npm i
npm run start:dev
```

### Build

```bash
npm run build
npm start
```

### Docker compose

```bash
cp .env.sample .env
docker-compose up --build -V --remove-orphans # for development environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -V
docker-compose down
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm test
```

### Migrations

```bash
npm run migration:generate <MIGRATION_NAME>
npm run migrate
npm run migrate:down
```

### Seeders

```bash
npm run seed:generate <SEEDER_NAME>
npm run seed
npm run seed:down
```

### API documentation

API documentation is generated using [@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger) module at `/api-docs` endpoint

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM
