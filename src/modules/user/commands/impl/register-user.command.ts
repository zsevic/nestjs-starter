import { ICommand } from '@nestjs/cqrs';
import { RegisterUserDto } from 'modules/user/dto';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly userDto: RegisterUserDto) {}
}
