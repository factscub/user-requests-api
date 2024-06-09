import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object (DTO) for existing user authentication.
 * Represents the user's email and password for authentication.
 */
export class ExistingUserDto {
  /**
   * User's email address.
   */
  @ApiProperty({
    description: 'Enter email',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * User's password (min length: 8 characters).
   */
  @ApiProperty({ description: 'Enter password', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  password: string;
}
