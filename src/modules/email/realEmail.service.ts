import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TemplatesNames } from './enums/templates.enum';

/**
 * RealEmailService handles the sending of real emails using the MailerService.
 * It supports different email templates based on the type of notification.
 */
@Injectable()
export class RealEmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Sends a notification email with the specified template and context.
   * @param toEmail - The recipient's email address.
   * @param subject - The subject of the email.
   * @param templateName - The name of the email template to use.
   * @param context - The context object containing the data for the template.
   * @returns A promise that resolves when the email is sent.
   */
  async sendNotificationEmail(
    toEmail: string,
    subject: string,
    templateName: string,
    context?: object,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: toEmail,
      subject: subject,
      html: this.sendMailFactory(templateName)(context),
    });
  }

  /**
   * Factory method to get the appropriate email template function based on the template name.
   * @param templateName - The template name.
   * @returns The email template function.
   */
  sendMailFactory(templateName: string) {
    if (templateName === TemplatesNames.APPLICATION_RECEIVED) {
      return this.applicationReceived;
    } else if (templateName === TemplatesNames.APPLICATION_RESOLVED) {
      return this.applicationResolved;
    }
  }

  /**
   * Generates the email content for the 'APPLICATION_RECEIVED' template.
   * @param param0 - An object containing the data for the template.
   * @returns The HTML content of the email.
   */
  applicationReceived({ name, message, created_at }: any) {
    created_at = new Date(created_at);
    return `
        <h1>Hello, ${name}!</h1>
        <p>Your application has been received at
        ${created_at.toLocaleString()}
        </p>
        <p>Your Message: ${message}</p>
    `;
  }

  /**
   * Generates the email content for the 'APPLICATION_RESOLVED' template.
   * @param param0 - An object containing the data for the template.
   * @returns The HTML content of the email.
   */
  applicationResolved({ name, message, comment, updated_at }: any) {
    updated_at = new Date(updated_at);
    return `
        <h1>Hello, ${name}!</h1>
        <p>Your Message: ${message}</p>
        <p>Your application has been Resolved at
        ${updated_at.toLocaleString()}
        </p>
        <p>Our Comment: ${comment}</p>
    `;
  }
}
