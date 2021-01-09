import path from 'path';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  entities: [path.join(__dirname, '/../../../**/*.entity.{js,ts}')],
  keepConnectionAlive: true,
  logging: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  type: 'postgres',
  url: process.env.DATABASE_URL,
}));
