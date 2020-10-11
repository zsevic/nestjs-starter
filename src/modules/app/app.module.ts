import {
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { Connection } from 'typeorm';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import config from 'common/config';
import databaseConfig from 'common/config/database';
import { EventsModule } from 'common/events/events.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AppController } from './app.controller';

const typeOrmConfig = {
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      expandVariables: true,
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    return configService.get('database');
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'configService',
      useFactory: () => new ConfigService(),
    },
  ],
})
@Injectable()
export class AppModule implements OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);
  private readonly shutdownListener$: Subject<void> = new Subject();

  constructor(private readonly connection: Connection) {}

  closeDatabaseConnection = async (): Promise<void> => {
    try {
      await this.connection.close();
      this.logger.log('Database connection is closed');
    } catch (error) {
      this.logger.error(error.message);
    }
  };

  onApplicationShutdown = async (signal: string): Promise<void> => {
    if (!signal) return;
    this.logger.log(`Detected signal: ${signal}`);

    this.shutdownListener$.next();
    return this.closeDatabaseConnection();
  };

  subscribeToShutdown = (shutdownFn: () => void): void => {
    this.shutdownListener$.subscribe(() => {
      this.logger.log('App is closed');
      shutdownFn();
    });
  };
}
