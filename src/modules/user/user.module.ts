import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';
import { UserRegisteredEvent } from './events/impl/user-registered.event';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

const CommandHandlers = [RegisterUserHandler];
const EventHandlers = [UserRegisteredEvent];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, ...CommandHandlers, ...EventHandlers],
  exports: [UserService],
})
export class UserModule {}
