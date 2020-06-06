import { RegisterUserDto } from 'modules/user/dto';

export class RegisterUserCommand {
  constructor(public readonly userDto: RegisterUserDto) {}
}
