import { Injectable, Logger } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRegisteredEvent } from './events/impl/user-registered.event';

@Injectable()
export class UserSagas {
  private readonly logger = new Logger(UserSagas.name);

  @Saga()
  userRegistered = (events$: Observable<any>): Observable<any> =>
    events$.pipe(
      ofType(UserRegisteredEvent),
      map(() => {
        this.logger.debug('Inside [UserSagas] Saga');
      }),
    );
}
