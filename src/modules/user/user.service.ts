import { Injectable } from '@nestjs/common';
import { RegisterUserDto, User } from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async register(payload: RegisterUserDto): Promise<User> {
    await this.userRepository.validate(payload.name, payload.email);

    return this.userRepository.register(payload);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }
}
