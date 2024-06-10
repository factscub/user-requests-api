import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApplicationDto } from './dto/createApplication.dto';
import { UpdateApplicationDto } from './dto/updateApplication.dto';
import { Application } from './entities/application.entity';
import { RealEmailService } from 'src/modules/email/realEmail.service';
import { NullEmailService } from '../email/nullEmail.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  ApplicationStatus,
  ApplicationsOrderBy,
} from './enums/applicationStatus.enum';
import { TemplatesNames } from 'src/modules/email/enums/templates.enum';

/**
 * Service for handling application-related operations such as creating, updating, retrieving, and deleting applications.
 */
@Injectable()
export class ApplicationService {
  /**
   * Constructs the ApplicationService.
   *
   * @param applicationRepository - Repository for the Application entity.
   * @param emailService - Service for sending email notifications.
   */
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @Inject('EMAIL_SERVICE')
    private readonly emailService: RealEmailService | NullEmailService,
  ) {}

  /**
   * Retrieves applications based on the provided status.
   *
   * @param status - Optional status to filter applications.
   * @returns A promise that resolves to an array of Application entities.
   * @throws BadRequestException if the status is invalid.
   */
  async getApplications(
    queryParams: Record<string, string>,
  ): Promise<Application[]> {
    const query = this.applicationRepository.createQueryBuilder('application');
    return await this.filterApplicationsByParams(query, queryParams);
  }

  /**
   * Creates a new application.
   *
   * @param createApplicationDto - Data transfer object containing application details.
   * @returns A promise that resolves to the created Application entity.
   */
  async createApplication(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto);
    await this.applicationRepository.save(application);

    // Send email notification on application submission
    await this.emailService.sendNotificationEmail(
      application.email,
      'Application Received',
      TemplatesNames.APPLICATION_RECEIVED,
      application,
    );

    return application;
  }

  /**
   * Updates an existing application.
   *
   * @param id - The ID of the application to update.
   * @param updateApplicationDto - Data transfer object containing updated application details.
   * @returns A promise that resolves to the updated Application entity.
   * @throws BadRequestException if the application is already resolved or if the status is invalid.
   */
  async updateApplication(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.getApplicationById(id);
    const { status, comment } = updateApplicationDto;
    const statusFound = ApplicationStatus[status];
    const resolvedStatus = ApplicationStatus.resolved;

    if (statusFound) {
      if (application.status === resolvedStatus) {
        throw new BadRequestException(
          `Application with ID "${application.id}" has already been "resolved"`,
        );
      } else if (status === resolvedStatus.toLowerCase()) {
        application.status = resolvedStatus;
        application.comment = comment;
        await this.applicationRepository.save(application);

        // Send email notification if resolved
        await this.emailService.sendNotificationEmail(
          application.email,
          'Application Resolved',
          TemplatesNames.APPLICATION_RESOLVED,
          application,
        );
      } else {
        throw new BadRequestException(
          'Status must be "resolved" (case-sensitive)',
        );
      }
    } else {
      throw new BadRequestException(
        'Status must be "resolved" (case-sensitive)',
      );
    }

    return application;
  }

  /**
   * Retrieves an application by its ID.
   *
   * @param id - The ID of the application to retrieve.
   * @returns A promise that resolves to the found Application entity.
   * @throws NotFoundException if the application is not found.
   */
  async getApplicationById(id: number): Promise<Application> {
    const found = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Application with ID "${id}" not found`);
    }

    return found;
  }

  /**
   * Deletes an application by its ID.
   *
   * @param id - The ID of the application to delete.
   * @returns A promise that resolves to the deleted Application entity.
   * @throws NotFoundException if the application is not found.
   */
  async deleteApplication(id: number): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found`);
    }
    return await this.applicationRepository.remove(application);
  }

  private async filterApplicationsByParams(
    query: SelectQueryBuilder<Application>,
    queryParams: Record<string, string>,
  ): Promise<Application[]> {
    for (const [key, value] of Object.entries(queryParams || {})) {
      switch (key) {
        case 'status':
          const status = ApplicationStatus[value];
          if (status) {
            query.andWhere('application.status = :status', { status });
          } else {
            throw new BadRequestException(
              'Status must be "active or resolved" (case-sensitive)',
            );
          }
          break;
        case 'orderByDate':
          const orderBy = ApplicationsOrderBy[value];
          if (orderBy) {
            query.orderBy('application.updated_at', orderBy);
          } else {
            throw new BadRequestException(
              'orderByDate must be "asc or desc" (case-sensitive)',
            );
          }
          break;
        // Add more cases for additional parameters
        default:
          // Handle unknown parameters or ignore them
          break;
      }
    }
    return await query.getMany();
  }
}
