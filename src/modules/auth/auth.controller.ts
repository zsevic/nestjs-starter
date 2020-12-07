import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUserDto, RegisterUserDto, User } from 'modules/user/dto';
import { UserService } from 'modules/user/user.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
} from './auth.constants';
import { AuthService } from './auth.service';
import { CustomAuthGuard, RolesGuard } from './guards';
import { Roles } from './roles/roles.decorator';
import { AppRoles } from './roles/roles.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginUserDto, @Res() res): Promise<User> {
    const user = await this.authService.validateUser(payload);
    const { accessToken, refreshToken } = this.authService.createTokens(
      user.id,
    );
    await this.userService.updateRefreshToken(user.id, refreshToken);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);

    return res.json(user);
  }

  @Post('register')
  async register(@Body() payload: RegisterUserDto): Promise<User> {
    return this.userService.register(payload);
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);

    return res.end();
  }

  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles(AppRoles.USER)
  @Get('me')
  async getLoggedInUser(@Request() request): Promise<User> {
    this.logger.log(request.user);
    return request.user;
  }
}
