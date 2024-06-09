import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

/**
 * The CreateApplicationDto class represents the data transfer object (DTO)
 * used for creating a new application.
 */
export class CreateApplicationDto {
  /**
   * The name of the applicant.
   */
  @ApiProperty({
    description: 'Name of the applicant',
    example: 'Iron Man',
  })
  @IsNotEmpty()
  name: string;

  /**
   * The email address of the applicant.
   */
  @ApiProperty({
    description: 'Email address of the applicant',
    example: 'example@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The message from the applicant.
   */
  @ApiProperty({
    description: 'Message from the applicant',
    example: 'My system crashed',
  })
  @IsNotEmpty()
  message: string;
}
