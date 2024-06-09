import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * The CreateApplicationMessageDto class represents the data transfer object (DTO)
 * used for creating a new application passing only message.
 */
export class CreateApplicationMessageDto {
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
