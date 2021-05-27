import { validateOrReject } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from 'common/entities/base.entity';
import { PasswordTransformer } from './transformers/password.transformer';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({
    nullable: true,
  })
  facebook_id?: string;

  @Column({
    nullable: true,
  })
  google_id?: string;

  @Column()
  name: string;

  @Column({ default: '' })
  avatar?: string;

  @Column()
  email: string;

  @Column({
    transformer: new PasswordTransformer(),
    nullable: true,
  })
  password?: string;

  @Column({
    nullable: true,
    select: false,
  })
  refresh_token: string;

  @Column()
  role: string;

  @BeforeInsert()
  async validate() {
    await validateOrReject(this);
  }
}
