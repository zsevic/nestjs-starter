import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/impl/register-user.command';
import { RegisterUserDto } from './dto';
import { ValidateUserQuery } from './queries/impl/validate-user.query';
import { User } from './user.payload';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly userRepository: UserRepository,
  ) {}

  async get(id: string): Promise<User> {
    return this.userRepository.get(id);
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.getByEmail(email);
  }

  async getByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.userRepository.getByEmailAndPassword(email, password);
  }

  async getByRefreshToken(refreshToken: string): Promise<User> {
    return this.userRepository.getByRefreshToken(refreshToken);
  }

  async findOrCreate(profile: any): Promise<User> {
    const user = await this.userRepository.getByEmail(profile.email);
    if (!user) {
      const newUser = await this.userRepository.createUser(profile);
      return newUser;
    }

    return user;
  }

  async register(payload: RegisterUserDto): Promise<void> {
    await this.queryBus.execute(
      new ValidateUserQuery(payload.name, payload.email),
    );
    return this.commandBus.execute(new RegisterUserCommand(payload));
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }
}
