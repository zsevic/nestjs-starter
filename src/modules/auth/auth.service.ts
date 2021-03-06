import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, User } from 'modules/user/dto';
import { UserService } from 'modules/user/user.service';
import { Tokens } from './auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  createAccessToken(userId: string): string {
    const expiresIn = this.configService.get('jwt.accessTokenExpiresIn');
    return this.jwtService.sign({ id: userId }, { expiresIn });
  }

  createRefreshToken(userId: string): string {
    const expiresIn = this.configService.get('jwt.refreshTokenExpiresIn');
    return this.jwtService.sign({ id: userId }, { expiresIn });
  }

  createTokens(userId: string): Tokens {
    return {
      accessToken: this.createAccessToken(userId),
      refreshToken: this.createRefreshToken(userId),
    };
  }

  async validateUser(payload: LoginUserDto): Promise<User> {
    const user = await this.userService.getByEmailAndPassword(
      payload.email,
      payload.password,
    );
    if (!user) {
      throw new UnauthorizedException('Wrong login combination');
    }

    return user;
  }

  validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (err) {
      this.logger.error(err.message);
      return false;
    }
  }
}
