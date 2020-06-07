import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateUserQuery } from 'modules/user/queries/impl/validate-user.query';
import { UserRepository } from 'modules/user/user.repository';

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
  private readonly logger = new Logger(ValidateUserHandler.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: ValidateUserQuery): Promise<void> {
    this.logger.debug('ValidateUserQuery...');
    await this.userRepository.validate(query.name, query.email);
  }
}
