import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enums/roles/roles.enum';

/**
 * Data transfer object (DTO) for creating a new user.
 */
export class CreateUserDto {
  /**
   * User's name.
   */
  @ApiProperty({ description: 'Enter name' })
  @IsNotEmpty()
  @IsString()
  name: string;

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
   * User's role type (optional, default is "user").
   */
  @ApiProperty({
    description: 'Enter role type (default is "user")',
    example: 'user | admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  role: Role;

  /**
   * User's password (min length: 8 characters).
   */
  @ApiProperty({ description: 'Enter password', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
