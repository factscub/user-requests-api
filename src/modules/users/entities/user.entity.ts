import { Role } from 'src/common/enums/roles/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Represents a user entity in the database.
 */
@Entity({ name: 'users' })
export class User {
  /**
   * The unique identifier for the user.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the user.
   */
  @Column()
  name: string;

  /**
   * The email address of the user.
   */
  @Column()
  email: string;

  /**
   * The password of the user.
   */
  @Column()
  password: string;

  /**
   * The role of the user, assigned from the Role enum.
   * Defaults to Role.User if not specified.
   */
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;
}
