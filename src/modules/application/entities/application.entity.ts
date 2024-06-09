import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents an application entity in the database.
 */
@Entity({ name: 'applications' })
export class Application {
  /**
   * The unique identifier for the application.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the applicant.
   */
  @Column()
  name: string;

  /**
   * The email address of the applicant.
   */
  @Column()
  email: string;

  /**
   * The status of the application.
   * Defaults to 'Active'.
   */
  @Column({ default: 'Active' })
  status: string;

  /**
   * The message provided by the applicant.
   */
  @Column('text')
  message: string;

  /**
   * Optional comments on the application.
   * Can be null if not provided.
   */
  @Column({ type: 'text', nullable: true })
  comment: string;

  /**
   * The date and time when the application was created.
   * This value is automatically set by the database.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * The date and time when the application was last updated.
   * This value is automatically set by the database.
   */
  @UpdateDateColumn()
  updated_at: Date;
}
