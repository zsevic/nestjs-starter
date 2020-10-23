import * as crypto from 'crypto';
import { BadRequestException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { methodTransformToDto } from 'common/decorators';
import { AppRoles } from 'modules/auth/roles/roles.enum';
import { RegisterUserDto, User } from './dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private readonly logger = new Logger(UserRepository.name);

  @methodTransformToDto(User)
  async get(id: string): Promise<UserEntity> {
    return this.findOne(id);
  }

  @methodTransformToDto(User)
  async getByEmail(email: string): Promise<UserEntity> {
    return this.findOne({
      select: ['id', 'avatar', 'email', 'name', 'role'],
      where: { email },
    });
  }

  @methodTransformToDto(User)
  async getByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const passwordHash = crypto.createHmac('sha256', password).digest('hex');

    return this.createQueryBuilder('user')
      .where('user.email = :email and user.password = :password')
      .setParameter('email', email)
      .setParameter('password', passwordHash)
      .getOne();
  }

  @methodTransformToDto(User)
  async getByRefreshToken(refreshToken: string): Promise<UserEntity> {
    const user = await this.findOne({ refresh_token: refreshToken });
    if (!user) {
      throw new BadRequestException('Refresh token is not valid');
    }

    return user;
  }

  @methodTransformToDto(User)
  async createUser(profile: any): Promise<UserEntity> {
    const provider_id = `${profile.provider}_id`;
    return this.save({
      [provider_id]: profile.id,
      avatar: profile.picture,
      email: profile.email,
      name: profile.displayName,
      role: AppRoles.USER,
    });
  }

  @methodTransformToDto(User)
  @Transactional()
  async register(payload: RegisterUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.email = payload.email;
    newUser.name = payload.name;
    newUser.password = payload.password;
    newUser.role = AppRoles.USER;

    return this.save(newUser).catch(() => {
      throw new BadRequestException();
    });
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
