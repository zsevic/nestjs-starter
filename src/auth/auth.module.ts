import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import configuration from 'src/common/configuration';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

const jwtFactory = {
  imports: [ConfigModule.forRoot({
    load: [configuration],
  })],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('JWT_SECRET_KEY'),
      signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') },
    };
  },
};

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtFactory),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule {}