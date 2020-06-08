import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from 'modules/user/commands/impl/register-user.command';
import { RegisterUserDto } from 'modules/user/dto';
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

  private async validate(userDto: RegisterUserDto): Promise<void> {
    await this.repository.validate(userDto.name, userDto.email);
  }

  async execute(command: RegisterUserCommand): Promise<void> {
    this.logger.debug('RegisterUserCommand...');
    const { userDto } = command;
    await this.validate(userDto);
    const registeredUser = await this.repository.register(userDto);

    const user = this.publisher.mergeObjectContext(
      new User(registeredUser.id, registeredUser.email, registeredUser.name),
    );
    user.register();
    user.commit();
  }
}
