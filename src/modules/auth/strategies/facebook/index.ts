import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';
import Strategy from 'passport-facebook';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class FacebookStrategy {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.init();
  }

  private init(): void {
    use(
      'facebook',
      new Strategy(
        {
          clientID: this.configService.get('facebook.clientID'),
          clientSecret: this.configService.get('facebook.clientSecret'),
          fbGraphVersion: this.configService.get('facebook.fbGraphVersion'),
          callbackURL: this.configService.get('facebook.callbackURL'),
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any,
        ): Promise<void> => {
          const user = await this.userService.findOrCreate(profile);

          done(null, user);
        },
      ),
    );
  }
}
