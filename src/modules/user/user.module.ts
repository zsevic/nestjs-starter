import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { UserRepository } from './user.repository';
import { UserSagas } from './user.sagas';
import { UserService } from './user.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [...CommandHandlers, ...EventHandlers, UserSagas, UserService],
  exports: [UserService],
})
export class UserModule {}
