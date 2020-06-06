import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, ...CommandHandlers, ...EventHandlers],
  exports: [UserService],
})
export class UserModule {}
