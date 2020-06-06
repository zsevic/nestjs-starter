import { AggregateRoot } from '@nestjs/cqrs';
import { UserRegisteredEvent } from 'modules/user/events/impl/user-registered.event';

export class User extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
  ) {
    super();
  }

  register() {
    this.apply(new UserRegisteredEvent());
  }
}
