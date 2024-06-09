import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { UpdateApplicationDto } from './dto/updateApplication.dto';
import { Application } from './entities/application.entity';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { Role } from 'src/common/enums/roles/roles.enum';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomRequest } from 'src/common/types/types';
import { CreateApplicationMessageDto } from './dto/createApplicationMessage.dto';
import { Request } from 'express';

/**
 * Controller for handling application-related HTTP requests.
 */
@ApiTags(
  'Requests (Must include the JWT token you got from signin or signup response in the Authorization header of your HTTP requests)',
)
@Controller('api/requests')
@UseGuards(RolesGuard)
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  /**
   * Get all applications. Only accessible by Admin.
   *
   * @param status - Optional status to filter applications.
   * @returns A promise that resolves to an array of Application entities.
   */
  @ApiOperation({
    summary: 'Get all applications(Only ADMIN can access the api)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved applications.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Status of the applications to filter by',
    enum: ['active', 'resolved'],
  })
  @ApiQuery({
    name: 'orderByDate',
    required: false,
    description:
      'Sort order of the applications by Date(updated_at "asc or desc")',
    enum: ['asc', 'desc'],
  })
  @Roles(Role.Admin)
  @Get()
  async getApplications(@Req() request: Request): Promise<Application[]> {
    const queryParams = request.query as Record<string, string>;
    return await this.applicationService.getApplications(queryParams);
  }

  /**
   * Get an application by its ID. Only accessible by Admin.
   *
   * @param id - The ID of the application to retrieve.
   * @returns A promise that resolves to the retrieved Application entity.
   */
  @ApiOperation({
    summary: 'Get an application by ID(Only ADMIN can access the api)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the application.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles(Role.Admin)
  @Get('/:id')
  async getApplicationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Application> {
    return await this.applicationService.getApplicationById(id);
  }

  /**
   * Create a new application. Accessible by both Admin and User.
   *
   * @param createApplicationMessageDto - Data transfer object containing application details.
   * @returns A promise that resolves to the created Application entity.
   */
  @ApiOperation({
    summary: 'Create an application(Both ADMIN and USER can access the api)',
  })
  @ApiResponse({
    status: 201,
    description:
      'The application has been submitted successfully and a mail has been sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: CreateApplicationMessageDto })
  @Roles(Role.Admin, Role.User)
  @Post()
  async createApplication(
    @Body() createApplicationMessageDto: CreateApplicationMessageDto,
    @Req() req: CustomRequest,
  ): Promise<Application> {
    const { email, name } = req.user;
    const { message } = createApplicationMessageDto;
    const createApplicationDto = {
      message,
      email,
      name,
    };
    return await this.applicationService.createApplication(
      createApplicationDto,
    );
  }

  /**
   * Resolve an existing application. Only accessible by Admin.
   *
   * @param id - The ID of the application to update.
   * @param updateApplicationDto - Data transfer object containing updated application details.
   * @returns A promise that resolves to the updated Application entity.
   */
  @ApiOperation({
    summary: 'Resolve an application(Only ADMIN can access the api)',
  })
  @ApiResponse({
    status: 200,
    description:
      'The application has been resolved successfully and a mail has been sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: UpdateApplicationDto })
  @Roles(Role.Admin)
  @Patch('/:id')
  async updateApplication(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return await this.applicationService.updateApplication(
      id,
      updateApplicationDto,
    );
  }

  /**
   * Delete an application by its ID. Only accessible by Admin.
   *
   * @param id - The ID of the application to delete.
   * @returns A promise that resolves to the deleted Application entity.
   */
  @ApiOperation({
    summary: 'Delete an application by ID(Only ADMIN can access the api)',
  })
  @ApiResponse({
    status: 200,
    description: 'The Application has been deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Roles(Role.Admin)
  @Delete('/:id')
  async deleteApplication(@Param('id') id: number): Promise<Application> {
    return await this.applicationService.deleteApplication(id);
  }
}
