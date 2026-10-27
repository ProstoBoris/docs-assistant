import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Enables pgvector, which adds the vector column type and similarity search. */
export class EnablePgvector1793102400000 implements MigrationInterface {
  name = 'EnablePgvector1793102400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS vector');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS vector');
  }
}
