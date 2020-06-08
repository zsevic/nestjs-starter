import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from 'modules/user/commands/impl/register-user.command';
import { User } from 'modules/user/user.model';
import { UserRepository } from 'modules/user/user.repository';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommand> {
  private readonly logger = new Logger(RegisterUserCommandHandler.name);

  constructor(
    private publisher: EventPublisher,
    private repository: UserRepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    this.logger.debug('RegisterUserCommand...');
    const registeredUser = await this.repository.register(command.userDto);

    const user = this.publisher.mergeObjectContext(
      new User(registeredUser.id, registeredUser.email, registeredUser.name),
    );
    user.register();
    user.commit();
  }
}
