import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from 'modules/user/events/impl/user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler
  implements IEventHandler<UserRegisteredEvent> {
  handle(event: UserRegisteredEvent) {
    console.log(`user ${event.email} is registered`);
  }
}
