import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RegisterUserCommand } from 'modules/user/commands/impl/register-user.command';
import { User } from 'modules/user/user.model';
import { UserRepository } from 'modules/user/user.repository';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private repository: UserRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { userDto } = command;

    const registeredUser = await this.repository.register(userDto);

    const user = this.publisher.mergeObjectContext(
      new User(registeredUser.id, registeredUser.email),
    );
    user.register();
    user.commit();
  }
}
