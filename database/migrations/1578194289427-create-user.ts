import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1578194289427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            generationStrategy: 'uuid',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'facebook_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'google_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'Date',
            default: 'current_timestamp',
          },
          {
            name: 'updated_at',
            type: 'Date',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
