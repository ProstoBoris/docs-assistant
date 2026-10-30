import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Always stored in lowercase, so lookups are case-insensitive. */
  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string;

  /**
   * Excluded from queries unless asked for explicitly, so the hash
   * can't end up in an API response by accident.
   */
  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
