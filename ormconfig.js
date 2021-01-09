module.exports = [
  {
    name: 'migration',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/**/**.entity{.ts,.js}'],
    migrations: ['database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    cli: {
      migrationsDir: 'database/migrations',
    },
    logging: true,
    synchronize: false,
  },
  {
    name: 'seed',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/**/**.entity{.ts,.js}'],
    migrations: ['database/seeders/*{.ts,.js}'],
    migrationsTableName: 'seeders',
    cli: {
      migrationsDir: 'database/seeders',
    },
    logging: true,
    synchronize: false,
  },
];
