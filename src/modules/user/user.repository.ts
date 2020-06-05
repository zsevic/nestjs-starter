import * as crypto from 'crypto';
import { BadRequestException, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AppRoles } from 'modules/auth/roles/roles.enum';
import { RegisterUserDto } from './dto';
import { UserEntity } from './user.entity';
import { User } from './user.payload';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private readonly logger = new Logger(UserRepository.name);

  async get(id: string): Promise<User> {
    const user = await this.findOne(id);

    return plainToClass(User, user);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      select: ['id', 'avatar', 'email', 'name', 'role'],
      where: { email },
    });

    return plainToClass(User, user);
  }

  async getByEmailAndPassword(email: string, password: string): Promise<User> {
    const passwordHash = crypto.createHmac('sha256', password).digest('hex');

    const user = await this.createQueryBuilder('user')
      .where('user.email = :email and user.password = :password')
      .setParameter('email', email)
      .setParameter('password', passwordHash)
      .getOne();

    return plainToClass(User, user);
  }

  async getByRefreshToken(refreshToken: string): Promise<User> {
    const user = await this.findOne({ refresh_token: refreshToken });
    if (!user) {
      throw new BadRequestException('Refresh token is not valid');
    }

    return plainToClass(User, user);
  }

  async createUser(profile: any): Promise<User> {
    const provider_id = `${profile.provider}_id`;
    const newUser = await this.save({
      [provider_id]: profile.id,
      avatar: profile.picture,
      email: profile.email,
      name: profile.displayName,
      role: AppRoles.USER,
    });
    const user = {
      id: newUser.id,
      avatar: newUser.avatar,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    return plainToClass(User, user);
  }

  @Transactional()
  async register(payload: RegisterUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.email = payload.email;
    newUser.name = payload.name;
    newUser.password = payload.password;
    newUser.role = AppRoles.USER;

    return this.save(newUser);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new BadRequestException('User is not valid');
    }

    await this.save({
      ...user,
      refresh_token: refreshToken,
    }).then(() => {
      this.logger.log('Refresh token is updated');
    });
  }

  async validate(name: string, email: string): Promise<void> {
    const qb = await this.createQueryBuilder('user')
      .where('user.name = :name', { name })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();
    if (user) {
      throw new BadRequestException('Name and email must be unique');
    }
  }
}
