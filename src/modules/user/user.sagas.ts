import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRegisteredEvent } from './events/impl/user-registered.event';

@Injectable()
export class UserSagas {
  @Saga()
  userRegistered = (events$: Observable<any>): Observable<any> => {
    return events$.pipe(
      ofType(UserRegisteredEvent),
      map(event => {
        console.log(event);
      }),
    );
  };
}
