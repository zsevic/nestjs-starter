import { Exclude } from 'class-transformer';

export class User {
  id?: string;

  @Exclude()
  facebook_id?: string;

  @Exclude()
  google_id?: string;

  name: string;

  email: string;

  role: string;

  @Exclude()
  password?: string;

  @Exclude()
  refresh_token?: string;
}
