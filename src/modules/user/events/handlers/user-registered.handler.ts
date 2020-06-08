import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from 'modules/user/events/impl/user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler
  implements IEventHandler<UserRegisteredEvent> {
  private readonly logger = new Logger(UserRegisteredEventHandler.name);

  // eslint-disable-next-line
  handle(event: UserRegisteredEvent) {
    this.logger.debug('UserRegisteredEvent...');
  }
}
