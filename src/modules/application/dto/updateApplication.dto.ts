import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * The UpdateApplicationDto class represents the data transfer object (DTO)
 * used for updating an existing application.
 */
export class UpdateApplicationDto {
  /**
   * The status of the application. Must be "resolved".
   */
  @ApiProperty({
    description: 'The status of the application must be "resolved"',
    example: 'resolved',
  })
  @IsNotEmpty()
  status: string;

  /**
   * Additional comment provided by the admin when resolving the application.
   */
  @ApiProperty({
    description: 'Admin must comment and change the status to "resolved"',
    example: 'Your issue solved',
  })
  @IsNotEmpty()
  comment: string;
}
